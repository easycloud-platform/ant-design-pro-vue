<template>
  <a-card :bordered="false">
    <iframe :src="src" scrolling="auto" frameborder="0" width="100%" height="100%">
    </iframe>
  </a-card>
</template>

<script>
export default {
  name: 'Log',
  data () {
    return {
      src: 'http://111.229.247.151:5601/'
    }
  }
}
</script>

<style >
.ant-card-body {
    padding: 24px;
    zoom: 1;
    height: 1080px;
}
</style>
