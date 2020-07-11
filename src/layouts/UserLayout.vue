<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <span class="title">
              <a-icon type="slack" />
            </span>
          </a>
        </div>
        <div class="desc">
        </div>
      </div>

      <route-view class="login"></route-view>

      <div class="footer">
        <!-- <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div> -->
        <div class="copyright">
          Copyright &copy; 2020 李前
        </div>
      </div>
      <div id="pointContainer"></div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import * as THREE from 'three'
const SEPARATION = 100
const AMOUNTX = 100
const AMOUNTY = 70

let container
let camera, scene, renderer

let particles
let particle
let count = 0

const mouseX = 85
const mouseY = -342

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {}
  },
  mounted () {
    document.body.classList.add('userLayout')
    this.initPoint()
    this.animate()
  },
  methods: {
    initPoint () {
      container = document.getElementById('pointContainer')
      camera = new THREE.THREE.PerspectiveCamera(
        120,
        window.innerWidth / window.innerHeight,
        1,
        10000
      )
      camera.position.z = 1000

      scene = new THREE.THREE.Scene()

      particles = []

      const PI2 = Math.PI * 2
      const material = new THREE.THREE.ParticleCanvasMaterial({
        color: '#1890ff',
        vertexColors: true,
        program: function (context) {
          context.beginPath()
          context.arc(0, 0, 0.6, 0, PI2, true)
          context.fill()
        }
      })

      let i = 0

      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++] = new THREE.THREE.Particle(material)
          particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
          particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
          scene.add(particle)
        }
      }

      renderer = new THREE.THREE.CanvasRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      container.appendChild(renderer.domElement)

      /* document.addEventListener("mousemove", this.onDocumentMouseMove, false);
        document.addEventListener("touchstart", this.onDocumentTouchStart, false);
        document.addEventListener("touchmove", this.onDocumentTouchMove, false); */

      //

      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate () {
      requestAnimationFrame(this.animate)

      this.render()
    },
    render () {
      camera.position.x += (mouseX - camera.position.x) * 0.05
      camera.position.y += (-mouseY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      var i = 0

      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++]
          particle.position.y =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50
          particle.scale.x = particle.scale.y =
            (Math.sin((ix + count) * 0.3) + 1) * 2 +
            (Math.sin((iy + count) * 0.5) + 1) * 2
        }
      }

      renderer.render(scene, camera)

      count += 0.1
    },
    handleAnimate () {
      const top =
        pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      const vh = document.documentElement.clientHeight
      const dom = document.querySelectorAll('.animate')
      const s = []
      s.slice.call(dom).forEach(v => {
        if (top + vh > v.offsetTop) {
          var delay = v.dataset.delay
          if (delay) {
            setTimeout(() => {
              v.style.opacity = 1
              v.classList.add(v.dataset.ani)
            }, delay)
          } else {
            v.style.opacity = 1
            v.classList.add(v.dataset.ani)
          }
        } else {
          v.classList.remove(v.dataset.ani)
          v.style.opacity = 0
        }
      })
    },
    /**
     * 清除模型，模型中有 group 和 scene,需要进行判断
     * @param scene
     * @returns
     */
    clearScene: function () {
      // 从scene中删除模型并释放内存
      const currObj = scene
      if (currObj instanceof THREE.Scene) {
        const children = currObj.children
        for (let j = 0; j < children.length; j++) {
          this.deleteGroup(children[j])
        }
      } else {
        this.deleteGroup(currObj)
      }
      this.animate = function () {}
      camera = null
      scene = null
      renderer = null
    },
    // 删除group，释放内存
    deleteGroup: function (group) {
      if (!group) return
      // 删除掉所有的模型组内的mesh
      group.traverse(function (item) {
        item.geometry.dispose()// 删除几何体
        item.material.dispose()// 删除材质
      })
    }
  },
  beforeDestroy: function () {
    this.clearCache()
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }
      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 60px;
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
        z-index: 9999;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
      #pointContainer {
        position: fixed;
        cursor: pointer;
        opacity: 1;
        bottom: 0px;
        height: 70%;
        z-index: -1;
      }
    }
  }
</style>
