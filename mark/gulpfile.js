const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const connect = require('gulp-connect')
const config = require('./config') 
const minifycss = require('gulp-minify-css')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const merge = require('merge-stream')
const webpack = require('webpack-stream')
const inject = require('gulp-inject')
const sass = require('gulp-sass')
// 处理html，将src中的html文件输出到dist中去
gulp.task('handle:html', function () {
    return gulp.src('./src/views/*/*.html')
        //.pipe(htmlmin(config.htmloptions))
        .pipe(gulp.dest('./dist'))
})


gulp.task('handle:css',function(){
		
	 let streams = [] //存放下面多个文件流的数组
    for (const page in config.cssoptions) { // 遍历多个页面
        for (const file in config.cssoptions[page]) { // 遍历各个页面中的多个打包css文件配置
            let stream = gulp.src(config.cssoptions[page][file])
              		.pipe(sass({outputStyle: 'compressed'}))
              		.pipe(autoprefixer({// 自动加前缀
                    browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],//last 2 versions- 主流浏览器的最新两个版本
                    cascade: false, //是否美化属性值 默认：true 像这样：
                    //-webkit-transform: rotate(45deg);
                    //        transform: rotate(45deg);
                    remove:true //是否去掉不必要的前缀 默认：true 
                }))
                .pipe(concat(file + '.css')) // 合并文件
                //.pipe(minifycss()) // 压缩文件
                .pipe(rename({suffix:'.min'})) //重命名
                .pipe(gulp.dest('./dist/'+ page +'/css')) // 输出到对应的目录中
            
            streams.push(stream) // 把当前的文件流存储到数组中
        }
    }
    return merge( ...streams )//合并多个文件流
})

gulp.task('handle:js',function(){	
//		 return gulp.src('src/entry.js')//这里瞎写一个就行
//       //真正的处理都是在这里的
//       .pipe(webpack({
//           mode: 'production',
//		   entry: {
//              index: './src/views/index/javas/index.js',
//               vendor: './src/views/index/javas/vendor.js',
//           }, // 入口
//           output: {
//               filename: '[name].min.js' // [name]代表在entry中键名是什么，打包出来的就是什么
//           }
//       }))
//       .pipe(gulp.dest('./dist/index/js'))

		
		
	let streams = []
    for (const page in config.jsoptions) {
        //判断如果入口是数组或者是字符串的话就是单出口，否则是多出口
        let entry = config.jsoptions[page]
        let filename = Array.isArray(entry) || ((typeof entry) === 'string') ? page : '[name]'
        let stream = gulp.src('src/entry.js')
            .pipe(webpack({
                mode: 'production',
                entry: entry,
                output: { filename: filename+'.min.js' },
                  module: {
                    rules: [ //webpack中在这里使用各种loader对代码进行各种编译
                        {
                            test: /\.js$/, // 对js文件进行处理
                            loader: 'babel-loader', // 使用babel-loader对其进行处理
                            query: {
                                presets: ['es2015'] // 将es6编译一下
                            }
                        }
                    ]
                }
			}))
		        .pipe(gulp.dest('./dist/' + page + '/js'))
        		streams.push(stream)
    }

    return merge( ...streams )

})

gulp.task('inject', function () {
    setTimeout(() => {
        config.pages.forEach(page => {
            var target = gulp.src('./dist/'+page+'/'+page+'.html');
            // It's not necessary to read the files (will speed up things), we're only after their paths:
            var sources = gulp.src(['./dist/'+page+'/js/*.js', './dist/'+page+'/css/*.css'], {read: false});
           
            target.pipe(inject(sources, { ignorePath: '/dist' }))
              .pipe(gulp.dest('./dist/'+page+''));
        })
    }, 1000);  
});

// 监听函数
gulp.task('watch', function () {
    gulp.watch('./src/views/*/*.html', ['handle:html','inject', 'reload'])
    gulp.watch('./src/**/*.scss', ['handle:css','inject', 'reload'])
    gulp.watch('./src/**/*.js', ['handle:js','inject', 'reload'])
    // 通配符中 * 指的是儿子这一代，** 指的是所有的后代
})


gulp.task('server', function () {
  connect.server(config.serveroptions)
})

gulp.task("reload", function(){
	return gulp.src("./dist/**/*.html") //让所有的html文件都重新加载一下
		.pipe(connect.reload());
})

gulp.task('default', ['server', 'handle:css','handle:html','handle:js','inject','watch'])












