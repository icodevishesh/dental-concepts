/* Dental Concepts admin + site data settings.
   backend: 'local'    -> data is kept in this browser (IndexedDB). For design review and testing only.
   backend: 'supabase' -> data is kept in your Supabase project (see admin/README.md; this file is public, so never put secret keys here). */
window.DC_CONFIG = {
  backend: 'local',
  supabaseUrl: '',
  supabaseAnonKey: '',
  // Local mode only: password for the admin screen. This is NOT secure; Supabase mode uses real sign-in.
  demoPassword: 'dc-admin'
};
