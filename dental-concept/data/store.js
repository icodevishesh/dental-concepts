/* DCStore: one data API for the admin panel and the public pages.
   Collections: posts, authors, leads, uploads, testimonials, events. Files are stored separately.
   Every method returns a Promise. Two adapters share the same API: local (IndexedDB) and supabase. */
(function () {
  'use strict';
  var CFG = window.DC_CONFIG || { backend: 'local' };
  var COLS = ['posts', 'authors', 'leads', 'uploads', 'testimonials', 'events'];
  var PUBLIC = { posts: 1, authors: 1, testimonials: 1, events: 1 };
  var uid = function () { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); };
  var now = function () { return new Date().toISOString(); };

  /* ------------------------------------------------------------ local (IndexedDB) */
  function Local() {
    var dbp = null;
    function db() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error('This browser cannot store data.'));
        var r = indexedDB.open('dental-concepts-admin', 1);
        r.onupgradeneeded = function () {
          var d = r.result;
          COLS.concat(['files', 'meta']).forEach(function (c) { if (!d.objectStoreNames.contains(c)) d.createObjectStore(c, { keyPath: 'id' }); });
        };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      });
      return dbp;
    }
    function tx(store, mode, fn) {
      return db().then(function (d) {
        return new Promise(function (res, rej) {
          var t = d.transaction(store, mode), s = t.objectStore(store), out = fn(s);
          t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); };
          t.onerror = function () { rej(t.error); };
        });
      });
    }
    return {
      mode: 'local',
      list: function (col) { return tx(col, 'readonly', function (s) { return s.getAll(); }).then(function (a) { return a || []; }); },
      get: function (col, id) { return tx(col, 'readonly', function (s) { return s.get(id); }); },
      save: function (col, obj) {
        obj = Object.assign({}, obj); if (!obj.id) { obj.id = uid(); obj.createdAt = now(); } obj.updatedAt = now();
        return tx(col, 'readwrite', function (s) { s.put(obj); }).then(function () { return obj; });
      },
      remove: function (col, id) { return tx(col, 'readwrite', function (s) { s.delete(id); }); },
      putFile: function (file, kind) {
        var rec = { id: uid(), name: file.name || 'file', type: file.type || 'application/octet-stream', size: file.size, kind: kind || 'media', blob: file, createdAt: now() };
        return tx('files', 'readwrite', function (s) { s.put(rec); }).then(function () { return { id: rec.id, name: rec.name, size: rec.size, type: rec.type, kind: rec.kind }; });
      },
      fileUrl: function (id) { return tx('files', 'readonly', function (s) { return s.get(id); }).then(function (r) { return r ? URL.createObjectURL(r.blob) : ''; }); },
      removeFile: function (id) { return tx('files', 'readwrite', function (s) { s.delete(id); }); },
      getMeta: function (k) { return tx('meta', 'readonly', function (s) { return s.get(k); }).then(function (r) { return r ? r.value : undefined; }); },
      setMeta: function (k, v) { return tx('meta', 'readwrite', function (s) { s.put({ id: k, value: v }); }); }
    };
  }

  /* ------------------------------------------------------------ supabase
     Tables (see admin/supabase-schema.sql): one table per collection with columns id uuid, data jsonb, created_at, updated_at.
     Buckets: "media" (public images) and "case-files" (private scans and RX forms). */
  function Supa() {
    var cp = null;
    function client() {
      if (cp) return cp;
      cp = new Promise(function (res, rej) {
        function make() { res(window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey)); }
        if (window.supabase) return make();
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
        s.onload = make; s.onerror = function () { rej(new Error('Could not load Supabase.')); };
        document.head.appendChild(s);
      });
      return cp;
    }
    var row = function (r) { return Object.assign({}, r.data, { id: r.id, createdAt: r.created_at, updatedAt: r.updated_at }); };
    var chk = function (r) { if (r.error) throw r.error; return r.data; };
    return {
      mode: 'supabase',
      client: client,
      list: function (col) { return client().then(function (c) { return c.from(col).select('*').order('created_at', { ascending: false }); }).then(chk).then(function (a) { return (a || []).map(row); }); },
      get: function (col, id) { return client().then(function (c) { return c.from(col).select('*').eq('id', id).maybeSingle(); }).then(chk).then(function (r) { return r ? row(r) : undefined; }); },
      save: function (col, obj) {
        var data = Object.assign({}, obj); delete data.id; delete data.createdAt; delete data.updatedAt;
        return client().then(function (c) {
          return obj.id ? c.from(col).update({ data: data, updated_at: now() }).eq('id', obj.id).select().single()
                        : c.from(col).insert({ data: data }).select().single();
        }).then(chk).then(row);
      },
      // public visitors may insert leads/uploads but cannot read them back
      insertOnly: function (col, obj) { return client().then(function (c) { return c.from(col).insert({ data: obj }); }).then(chk); },
      remove: function (col, id) { return client().then(function (c) { return c.from(col).delete().eq('id', id); }).then(chk); },
      putFile: function (file, kind) {
        var bucket = kind === 'case' ? 'case-files' : 'media', path = uid() + '/' + (file.name || 'file').replace(/[^\w.\-]+/g, '_');
        return client().then(function (c) { return c.storage.from(bucket).upload(path, file); }).then(chk)
          .then(function () { return { id: bucket + ':' + path, name: file.name, size: file.size, type: file.type, kind: kind || 'media' }; });
      },
      fileUrl: function (id) {
        var i = id.indexOf(':'), bucket = id.slice(0, i), path = id.slice(i + 1);
        return client().then(function (c) {
          if (bucket === 'media') return c.storage.from(bucket).getPublicUrl(path).data.publicUrl;
          return c.storage.from(bucket).createSignedUrl(path, 600).then(chk).then(function (d) { return d.signedUrl; });
        });
      },
      removeFile: function (id) { var i = id.indexOf(':'); return client().then(function (c) { return c.storage.from(id.slice(0, i)).remove([id.slice(i + 1)]); }); },
      getMeta: function () { return Promise.resolve(undefined); },
      setMeta: function () { return Promise.resolve(); },
      signIn: function (email, pw) { return client().then(function (c) { return c.auth.signInWithPassword({ email: email, password: pw }); }).then(chk); },
      signOut: function () { return client().then(function (c) { return c.auth.signOut(); }); },
      session: function () { return client().then(function (c) { return c.auth.getSession(); }).then(function (r) { return r.data && r.data.session; }); }
    };
  }

  var S = CFG.backend === 'supabase' && CFG.supabaseUrl ? Supa() : Local();
  S.COLS = COLS; S.PUBLIC = PUBLIC; S.uid = uid;
  /* helpers used by public pages */
  S.published = function (col) {
    return S.list(col).then(function (a) { return a.filter(function (x) { return x.status === 'published'; }); }).catch(function () { return []; });
  };
  S.submit = function (col, obj) { // public form submissions (leads, uploads)
    obj = Object.assign({ status: 'new' }, obj);
    return S.mode === 'supabase' ? S.insertOnly(col, obj) : S.save(col, obj);
  };
  S.slugify = function (s) { return String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); };
  window.DCStore = S;
})();
