<template>
  <v-card class="overflow-hidden">
      <v-app-bar
        relative
        color="indigo darken-2"
        dark
        shrink-on-scroll
        prominent
        scroll-target="#scrolling-techniques"
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
  
        <v-app-bar-title>Title</v-app-bar-title>
  
        <v-spacer></v-spacer>
  
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
     
    </v-card>
</template>
<script>
export default {
  name: 'AppBar'
  }
  </script>