<template>
  <q-layout>
    <q-header elevated class="bg-light-green-7">
      <q-toolbar>
        <q-toolbar-title class="absolute-center"> BoxGarden </q-toolbar-title>
        <q-btn flat dense @click="openWelcomePage" icon="home" />
        <q-space />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: "LoginPageLayout",
  methods: {
    openWelcomePage() {
      this.$router.push("/");
    }
  }
};
</script>
