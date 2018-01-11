var gulp = require('gulp'),
    del = require('del');
    minifyCss = require('gulp-minify-css'),
    cached = require('gulp-cached'),
    concat =require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'), // 保存自动刷新
    reload = browserSync.reload,
    rev = require('gulp-rev'),                                //- 对文件名加MD5后缀
    watch = require('gulp-watch'),
    revCollector = require('gulp-rev-collector'),
    imagemin =require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer');

//基础变量
let AppPath = './src/',
    buildPath = './dist/',
    cssSrc = AppPath + 'static/css/*.css',
    distCssSrc = buildPath + 'static/css/',
    sassSrc = AppPath + 'static/css/*.scss',
    imgSrc = AppPath + 'static/img/*.{png,jpg,gif,ico}',
    distImgSrc = buildPath + 'static/img/',
    jsSrc = AppPath + 'static/js/**/*.js',
    distJsSrc = buildPath + 'static/js/';

// imgMin
gulp.task('imgMin', function() {
  return gulp.src(imgSrc)
    .pipe(cached('image'))
    .pipe(
      imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })
      )
    .pipe(gulp.dest(distImgSrc))
    .pipe(reload({stream:true}));
});

gulp.task('stream', function () {
    // Endless stream mode

    return watch(imgSrc,function(){
      del(distImgSrc);
      gulp.src(imgSrc).pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
    .pipe(gulp.dest(distImgSrc))
  }).pipe(reload({stream:true}));

});
gulp.task('css', function() {
  del(distCssSrc + '**/*.css');
  return gulp.src(cssSrc)
    // .pipe(concat('index.min.css'))
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: false, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove:true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest(distCssSrc))
    .pipe(reload({stream:true}));
});

// css （拷贝 *.min.css，常规 CSS 则输出压缩与未压缩两个版本）
gulp.task('revcss', function() {
  del(distCssSrc + '**/*.css');
  return gulp.src(cssSrc)
    .pipe(concat('index.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest(distCssSrc))                               //- 输出文件本地
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev'));
});

gulp.task('copyhtml',  function() {
   var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
  return gulp.src(AppPath + './*.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest(buildPath))
});

gulp.task('rev',['revcss'],function() {
    gulp.src(['./rev/*.json', AppPath + '*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest(buildPath));                     //- 替换后的文件输出的目录
});
// script （拷贝 *.min.js，常规 js 则输出压缩与未压缩两个版本）
gulp.task('script', function() {
  // del(distJsSrc + '**/*.js');
  return gulp.src(jsSrc)
    .pipe(cached('script'))
    .pipe(uglify())
    .pipe(gulp.dest(distJsSrc))
    .pipe(reload({stream:true}))
});

gulp.task('watch',['css','script','imgMin','copyhtml'],function() {
  browserSync.init(null,{
        server: {
          baseDir : 'dist'
        }
     });
     gulp.watch(cssSrc, ['css']);
     gulp.watch(jsSrc, ['script']);
     gulp.watch(imgSrc, ['imgMin']);
     gulp.watch(AppPath + "*.html",['copyhtml']).on('change', browserSync.reload);
    //  gulp.watch("js/*.js", ['js'])
    // 监控 dist 目录下除 css 目录以外的变动（如js，图片等），则自动刷新页面

});