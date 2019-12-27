<i18n src="./main.json"></i18n>
<template>
  <div class="f-pb-presentaion">
    <div class="f-pb-p-tags-box" v-if="pbTags.length">
      <el-button type="text" size="small" :class="{'selected': selectedTag.length === 0}" @click="emptySelectedTag">{{$t('pbTags[0]')}}</el-button>
      <el-button
        size="small"
        type="text" 
        v-for="tag in pbTags" :key="tag" 
        :class="{'selected': selectedTag.indexOf(tag) !== -1}"
        @click="tapFilterTag(tag)">{{ tag }}
      </el-button>
    </div>
    <div class="f-pb-p-list">
      <el-card 
        class="f-pb-p-item" 
        shadow="never"
        :body-style="{ padding: 0 }" 
        v-for="(pb, index) in pbMdList" 
        :key="'pb' + index"
        v-show="targetPbMdList.indexOf(pb.presentableId) > -1">
        <el-image class="f-pb-p-img" :src="pb.previewImgUrl" :preview-src-list="pb.previewImages || pb.releaseInfo.previewImages || []" fit="contain"></el-image>
        <div class="f-pb-p-info">
          <div class="f-pb-p-i-name">{{pb.presentableName}}</div>
          <div class="f-pb-p-i-tags">
            <el-tag v-for="tag in pb.userDefinedTags" :key="tag" size="small">
              {{ tag }}
            </el-tag>
          </div>
          <div class="f-pb-i-intro">
            {{pb.releaseInfo && pb.releaseInfo.intro !== '' ? pb.releaseInfo.intro : $t('releaseEmptyIntro')}}
          </div>
          <div class="f-pb-p-i-btn-group">
            <el-button type="primary" size="mini" class="f-pb-p-i-btn-auth" v-if="pb.pbReleaseDetailPageUrl">
              <a :href="pb.pbReleaseDetailPageUrl" target="_blank">获取授权</a>
            </el-button>
          </div>
          <div class="f-pb-p-i-btn-demo" :class="{'disabled': !pb.demoSite}" @click="tapDemoPreviewBtn(pb.demoSite)">
            <span v-show="pb.demoSite">{{pb.demoSite}}</span>
            <a :href="pb.demoSite" target="_blank"><i class="el-icon-caret-right"></i>{{$t('pbDemo')}}</a>
          </div>
          <div class="f-pb-p-usage-btn" @click="tapViewUsageBtn(index)">
            {{pb.mdBoxVisible ? $t('pbUsageBtns[0]') : $t('pbUsageBtns[1]') }} 
            <i class="el-icon-caret-bottom" :class="{'rotate180': pb.mdBoxVisible}"></i>
          </div>
        </div>
        <div class="f-pb-p-usage">
          <div class="f-pb-p-usage-content" :class="{'visible': pb.mdBoxVisible}" :style="{ height: pb.usageMdBoxheight }"> 
            <div class="f-pb-p-u-md-box" :ref="pb.pbMdBoxRef"></div>
          </div>
        </div>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import MarkdownParser from '@freelog/freelog-markdown-parser'
export default {
  name: 'node-example',
  components: {},
  data() {
    return {
      pbDemosNodeId: 80000058,
      fetchPbMdTags: 'pb-md',
      refPbUsagePrefix: 'pbUsage',
      pbMdList: [],
      pbMdDataMap: {},
      pbDemoPreviewSiteMap: null,
      pbTagsSet: new Set(),
      pbTags: [],
      selectedTag: []
    }
  },
  computed: {
    targetPbMdList() {
      return this.pbMdList.filter(p => {
        const leng1 = this.selectedTag.length
        if(leng1 === 0) return true
        const leng2 = p.userDefinedTags.length
        const size = new Set([...p.userDefinedTags, ...this.selectedTag]).size
        if(size === leng2) {
          return true
        }else {
          return false
        }
      }).map(p => p.presentableId)
    }
  },
  watch: {
    pbDemoPreviewSiteMap() {
      this.pbMdList = this.pbMdList.map(p => {
        const { releaseInfo } = p
        if (releaseInfo && releaseInfo.releaseName) {
          const tmp = this.pbDemoPreviewSiteMap[releaseInfo.releaseName]
          if (tmp) {
            p.PB_releaseName = tmp['PB-releaseName']
            const releaseName = encodeURIComponent(p.PB_releaseName) 
            const host = window.FreelogApp.Env.isTest ? 'console.testfreelog.com' : 'console.freelog.com'
            p.pbReleaseDetailPageUrl = `//${host}/release/detail?releaseName=${releaseName}`
            p.demoSite = tmp['PB-demo-site']
          }
        }
        return p
      })
    }
  },
  created() {
    this.fetchPbMarkdownList()
    this.fetchDemoPreviewSiteData()
  },
  mounted() {
    
  },
  methods: {
    fetchPbMarkdownList() {
      const tag = 'pb-md'
      const refPbUsagePrefix = 'pbUsage'
      return this.$axios.get('/v1/presentables/authList', {
          params: { 
            nodeId: this.pbDemosNodeId,
            tags: tag, 
            isLoadingResourceInfo: 1 
          }
        })
        .then(resp => {
          return resp.data
        })
        .then(res => {
          
          if(res.errcode === 0) {
            this.pbMdList = res.data.dataList.map((p, index) => {
              const { userDefinedTags, releaseInfo: { previewImages = [], releaseId, version } } = p
              p.userDefinedTags = userDefinedTags.filter(item => {
                if(item !== tag) {
                  this.pbTagsSet.add(item)
                  return true
                }else {
                  return false
                }
              })
              
              p.previewImgUrl = 'http://test-frcdn.oss-cn-shenzhen.aliyuncs.com/console/public/img/resource.jpg'
              if(previewImages.length) {
                p.previewImgUrl = previewImages[0]
              }
              p.usageMdBoxheight = 0
              p.mdBoxVisible = false
              p.pbMdBoxRef = refPbUsagePrefix + index
              this.renderPbMarkdown(p)
              return p
            })
            
            this.pbTags = [...this.pbTagsSet]
          }
        })
        .catch(e => console.log(e))
      
    },
    renderPbMarkdown(presentable) {
      const { presentableId, pbMdBoxRef } = presentable
      return this.loadMarkdownData(presentableId)
        .then(() => {
          const markdownData = this.pbMdDataMap[presentableId]
          const container = this.$refs[pbMdBoxRef] ?this.$refs[pbMdBoxRef][0] : null
          
          if(!markdownData || container == null) return 
          var markdownParser = new MarkdownParser({
            showToc: false,
            container,
            presentableId,
            subReleases: [],
            renderImageError($el, data) {
              if ($el) {
                $el.src = ''
                //todo
                if (typeof data === 'string') {
                  $el.src = ''
                } else {
  
                }
              }
              console.log('renderImageError', arguments)
            }
          })
          markdownParser.render(markdownData)
        })
        .catch(e => console.log(e))
        .finally(() => {
          this.loadingVisible = false
          window.scrollTo({ top: 0, behavior: "instant" })
        })
    },
    fetchDemoPreviewSiteData() {
      return this.$axios.get('/v1/presentables/authList', {
          params: { 
            nodeId: this.pbDemosNodeId,
            resourceType: 'json', 
            tags: 'demo-site', 
            pageSize: 99 
          }
        })
        .then(resp => resp.data)
        .then(res => {
          var target = null
          if(res.errcode === 0) {
            target = res.data.dataList[0]
          }else {
            this.$message.error(res.msg)
          }
          return target
        })
        .then(p => {
          if(p != null) {
            return this.loadPresentableData(p.presentableId)
          }else {
            return Promise.reject()
          }
        })
        .then(res => {
          if(res.errcode != null) {
            // 授权错误
          }else {
            try {
              if (typeof res === 'object') {
                this.pbDemoPreviewSiteMap = res
              } else {
                const map = JSON.parse(res)
                this.pbDemoPreviewSiteMap = map
              }
            }catch(e) {
              console.warn('fetchDemoPreviewSiteData', e)
            }
          }
        })
    },
    loadMarkdownData(presentableId) {
      if(this.pbMdDataMap[presentableId]) {
        return Promise.resolve(this.pbMdDataMap[presentableId])
      }else {
        return this.loadPresentableData(presentableId)
          .then((markdownData) => {
            if(typeof markdownData === 'string') {
              this.pbMdDataMap[presentableId] = markdownData
            }else {
              // markdown发行 授权未通过
            }
          })
      }
    },
    loadPresentableData(presentableId) {
      return this.$axios.get(`/v1/presentable/${presentableId}/data`).then(resp => {
        return resp.data
      })
    },
    tapViewUsageBtn(index) {
      const pb = this.pbMdList[index]
      pb.mdBoxVisible = !pb.mdBoxVisible
      if(pb.mdBoxVisible) {
        const ref = this.refPbUsagePrefix + index
        if(this.$refs[ref].length) {
          const $dom = this.$refs[ref][0]
          pb.usageMdBoxheight = $dom.offsetHeight + 'px'
        }
      }else {
        pb.usageMdBoxheight = 0
      }
    },
    tapFilterTag(tag) {
      const index = this.selectedTag.indexOf(tag)
      if(index !== -1) {
        this.selectedTag.splice(index, 1)
      }else {
        this.selectedTag.push(tag)
      }
    },
    emptySelectedTag() {
      this.selectedTag = []
    },
    tapDemoPreviewBtn(url) {
      window.open(url)
    }
  },
}
</script>

<style lang="less">
@import '../../styles/variables.less';
.f-pb-presentaion {
  width: @main-content-width-1190; margin: auto; 
  .f-pb-p-tags-box {
    margin: 10px 20px 0; padding-bottom: 25px; border-bottom: 1px solid #E3E3E3; text-align: center;
    .el-button {
      margin: 10px 3px 0; padding: 4px 9px; 
      color: #999; cursor: pointer;
      &.selected {
        margin: 0 5px; border-radius:4px;
        background-color: #E8EDF3; color: #666;
      }
    }
  }

  .f-pb-p-item {
    position: relative;
    margin: 20px; border-width: 0; border-bottom: 1px solid #E3E3E3; border-radius: 0;
    background-color: #FAFBFB;
  }

  @imgWidth: 140px; @imgHeight: 105px;

  .f-pb-p-img {
    float: left;
    width: @imgWidth; height: @imgHeight; border: 1px solid #d8d8d8;
  }

  .f-pb-p-info {
    position: relative;
    min-height: @imgHeight ; padding-left: @imgWidth + 20; 
    .f-pb-p-i-name { font-size: 18px; font-weight: 600; color: #333; }
    .f-pb-p-i-tags {
      margin-top: 20px;
      .el-tag { 
        height: 20px; margin-right: 8px; margin-bottom: 10px; padding: 0 5px; border-color: #EFEFEF; border-radius: 2px;
        line-height: 20px; font-size: 12px; background-color: #EFEFEF; color: #666;
      }
    }
    .f-pb-i-intro {
      display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4;
      overflow: hidden;
      font-size: 14px; color: #333;
    }
    .f-pb-p-i-btn-demo { 
      position: absolute; bottom: 0;
      font-size: 14px; color: #666;
      span { margin-right: 30px; }
      a { color: #E7AF0E; }
      .el-icon-caret-right {
        font-size: 18px; transform: translateY(1px);
      }
      &.disabled { opacity: .5; pointer-events: none; cursor: not-allowed; }
    }
    .f-pb-p-i-btn-group {
      position: absolute; top: 0; right: 0;
      .f-pb-p-i-btn-auth { border-radius: 2px; }
      a { color: #fff; }
    }
  }

  .f-pb-p-usage {
    margin-top: 20px;

    .f-pb-p-usage-content {
      overflow: hidden;
      height: 0; transition: height .2s; background-color: #fff;
      .f-pb-p-u-md-box {
        visibility: hidden;
        padding: 20px; 
      }
      &.visible { 
        margin-bottom: 20px;
        .f-pb-p-u-md-box { visibility: visible; }
      }
    }
  } 
  .f-pb-p-usage-btn {
    position: absolute; right: 0; bottom: 0; cursor: pointer;
    font-size: 14px; 
    color: #666; text-align: center;
    &:hover { color: #409EFF; }
    .el-icon-caret-bottom {
      transition: all .2s;
      &.rotate180 {
        transform: rotate(180deg); 
      }
    }
  }

  @media screen and (max-width: 768px){
    .f-pb-p-tags-box {
      margin: 10px 10px 0;
      .el-tag {
        margin-right: 8px; margin-top: 8px; padding: 0 5px;
      }
    }
    .f-pb-p-list {
      .f-pb-p-item {
        margin: 15px 10px; background-color: #FAFBFB;
        .el-card__body { padding: 8px 10px; }
        .f-pb-p-img {
          box-sizing: border-box;
          float: none; width: 100%; height: 150px;
        }
        .f-pb-p-info {
          position: relative; min-height: inherit; padding: 10px 0;
          .f-pb-p-i-tags {
            margin: 8px 0; 
            .el-tag{
              margin-right: 3px; margin-bottom: 2px; transform: scale(0.9);
            }
          }
          .f-pb-p-i-name { font-size: 16px; }
          .f-pb-i-intro { font-size: 12px; }
          .f-pb-p-i-btn-group {
            top: 10px; right: 0;
            .f-pb-p-i-btn-auth { display: none; }
          }
        }
        .f-pb-p-usage { 
          margin-top: 5px; 
          .f-pb-p-u-btn-bar { 
            font-size: 13px; line-height: 32px; 
            background-color: #fff; color: #409EFF;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1250px) {
  .f-pb-presentaion {
    width: @main-content-width-990;
  }
}
</style>

