  const config = {
    htmloptions: { //html压缩的配置
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    },
    serveroptions: {// 热更新服务
        root: './dist',
        port: 8000,
        livereload: true 
    },
    pages:['index','list','car'],
	    cssoptions:{
	    	'index':{
	    	'common':[
	    			'./src/style/reset.css',
	    			'./src/views/index/style/common/*.scss'
	    	],
	    	'index':'./src/views/index/style/index/*.scss'
	    },
		    'list': {
	        'list': [
	          './src/stylesheets/reset.scss',
	          './src/views/list/*/*.scss'
	            ]
	        }
    },
     jsoptions: {// js配置
        'index': { //首页的入口
            index: './src/views/index/javas/index.js',
            vendor: './src/views/index/javas/vendor.js'
        },
        'list': './src/views/list/javas/list.js'
    }
}

// 把config暴露出去，是为了在其他地方用，只能暴露一次
module.exports = config