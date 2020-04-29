<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1>{{ appTitle() }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'
import { mapGetters } from 'vuex'
export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
  },
  methods: {
    ...mapGetters(['appTitle'])
  }
}
</script>
