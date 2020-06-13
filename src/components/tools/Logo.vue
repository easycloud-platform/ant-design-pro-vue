<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <a-icon type="slack" />
      <h1>{{ appTitle() }}</h1>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Logo',
  components: {
  },
  props: {
  },
  methods: {
    ...mapGetters(['appTitle'])
  }
}
</script>
