<template>
  <aside class="w-64 bg-gray-800 text-white h-screen p-4">
    <h2 class="text-lg font-bold mb-4">Dashboard</h2>
    <ul>
      <li><router-link to="/poster-dashboard" class="block py-2">Poster</router-link></li>
      <li><router-link to="/provider-dashboard" class="block py-2">Provider</router-link></li>
      <li><router-link to="/admin-dashboard" class="block py-2">Admin</router-link></li>
      <li><router-link to="/crm" class="block py-2">CRM</router-link></li>
    </ul>
  </aside>
</template>
