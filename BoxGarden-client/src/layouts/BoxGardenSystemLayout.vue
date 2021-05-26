<template>
  <q-layout>
    <q-header elevated class="bg-light-green-7">
      <q-toolbar>
        <q-btn
          flat
          dense
          @click="rightDrawerOpen = !rightDrawerOpen"
          icon="menu"
          aria-label="Menu"
          class="q-mr-sm absolute-right"
          size="1rem"
        />
        <q-toolbar-title class="absolute-center">
          BoxGarden
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/Sensors">
          <q-item-section avatar>
            <q-icon name="settings_input_antenna" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sensors</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/BoxGardens">
          <q-item-section avatar>
            <q-icon name="view_in_ar" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Box Gardens</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/Users">
          <q-item-section avatar>
            <q-icon name="supervised_user_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Users</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/Measurements">
          <q-item-section avatar>
            <q-icon name="perm_data_setting" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Measurements</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="home">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>
          <q-item-section>
            <q-item-label>LogOut</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: "BoxGardenSystemLayout",
  data() {
    return {
      rightDrawerOpen: false
    };
  },
  methods: {
    logout() {
      this.$auth.signOut().then(() => {
        this.$router.push("/");
      });
    },
    home() {
      this.$router.push("/");
    }
  }
};
</script>
