var gulp = require('gulp'),
  livereload = require('gulp-livereload'),
  cssBase64 = require('gulp-css-base64'),
  concat = require('gulp-concat'),
  gulpIf = require('gulp-if'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'),
  minifyHTML = require('gulp-minify-html'),
  autoprefixer = require('gulp-autoprefixer'),
  inline = require('gulp-inline'),
  sequence = require('gulp-sequence'),
  psi = require('psi'),
  prod=true;
/*-------------------------------------------------------------------------------------------------*/
gulp.task('res-js', function () {
  return gulp.src(['./dev/JS/res.js'])
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('fl-js', function () {
  return gulp.src(['./dev/JS/fl.js'])
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('fl2-js', function () {
  return gulp.src(['./dev/JS/fl2.js'])
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp'));
});
/*-------------------------------------------------------------------------------------------------*/
gulp.task('partials-html', function () {
  return gulp.src('./dev/partials/*.html')
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/partials'));
});
/*-------------------------------------------------------------------------------------------------*/

gulp.task('dash-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/d_go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/login.js','./dev/JS/signup.js','./dev/JS/page.js',
                  './dev/JS/d_slots_handler.js','./dev/JS/d_url_handler.js','./dev/JS/d_contacts.js',
                  './dev/JS/d_slots_render.js','./dev/JS/d_slots_update.js','./dev/JS/d_toolbar.js','./dev/JS/d_profile.js',
                  './dev/JS/d_package.js','./dev/JS/d_products.js','./dev/JS/d_services.js',
                  './dev/JS/d_easter.js','./dev/JS/d_main.js'])
    .pipe(concat('dash.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('dash-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css','./dev/CSS/d_reset.css',
                  './dev/CSS/resp.css','./dev/CSS/d_svg.css','./dev/CSS/d_grad.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/d_main.css','./dev/CSS/d_main_resp.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/d_contacts.css','./dev/CSS/d_contacts_resp.css',
                  './dev/CSS/anim.css',
                  './dev/CSS/d_debug.css','./dev/CSS/validation.css','./dev/CSS/flagblocklist.css'])
    .pipe(concat('dash.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('dash-html', function () {
  return gulp.src(['./dev/_views/dash/dash_head.html',"./dev/partials/favicon.html",'./dev/_views/dash/dash_head2.html',
                  './dev/partials/logo_svg.html','./dev/partials/dashboard_svg.html',
                  './dev/partials/msg_svg.html','./dev/partials/cross_svg.html',
                  './dev/_views/dash/dash_close_svg.html','./dev/partials/modal.html','./dev/_views/dash/dash_header.html',
                  './dev/partials/msg_html.html','./dev/_views/dash/dash_main.html','./dev/partials/footer.html',
                  './dev/_views/dash/dash_footer.html','./dev/partials/flash_js.html','./dev/_views/dash/dash_end.html'])
      .pipe(concat('dashboard.html'))
      .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('dash-inline', function () {
  return gulp.src('./dev/_tmp/dashboard.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*-----------------------------------------------------------------------------------------------------*/
// gulp.task('index_old-js', function () {
//   return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
//                   './dev/JS/funcs.js','./dev/JS/go.js',
//                   './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
//                   './dev/JS/evnt.js','./dev/JS/elm.js',
//                   './dev/JS/date.js','./dev/JS/msg.js',
//                   './dev/JS/validation.js','./dev/JS/mw.js',
//                   './dev/JS/login.js','./dev/JS/signup.js','./dev/JS/page.js',
//                   './dev/JS/p_index_old.js'])
//     .pipe(concat('index_old.js'))
//     //.pipe(gulpIf(prod,uglify()))
//     .pipe(gulp.dest('./dev/_tmp'));
// });
// gulp.task('index_old-css', function () {
//   return gulp.src(['./dev/CSS/beforeload.css',
//                   './dev/CSS/i_reset.css','./dev/CSS/i_svg.css','./dev/CSS/resp.css',
//                   './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
//                   './dev/CSS/i_old_main.css',
//                   './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
//                   './dev/CSS/anim.css','./dev/CSS/validation.css'])
//     .pipe(concat('index_old.css'))
//     .pipe(autoprefixer({
//             browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
//             cascade: false,
//             remove: true
//         }))
//     .pipe(minifyCss())
//     .pipe(gulp.dest('./dev/_tmp'));
// });
// gulp.task('index_old-inline', function () {
//   return gulp.src('./dev/index_old.html')
//       .pipe(inline())
//       .pipe(minifyHTML())
//       .pipe(gulp.dest('./views/'));
// });
/*-----------------------------------------------------------------------------------------------------*/
gulp.task('index-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/login.js','./dev/JS/signup.js','./dev/JS/page.js',
                  './dev/JS/p_index.js'])
    .pipe(concat('index.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('index-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css',
                  './dev/CSS/resp.css','./dev/CSS/i_resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/i_main.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css'])
    .pipe(concat('index.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('index-inline', function () {
  return gulp.src('./dev/index.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('login-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/login.js','./dev/JS/signup.js','./dev/JS/page.js',
                  './dev/JS/p_login.js'])
    .pipe(concat('login.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('login-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css',
                  './dev/CSS/msg_resp.css','./dev/CSS/i_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css'])
    .pipe(concat('login.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('login-inline', function () {
  return gulp.src('./dev/login.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('signup_step1-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_signup_step1.js'])
    .pipe(concat('signup_step1.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('signup_step1-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css'])
    .pipe(concat('signup_step1.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('signup_step1-inline', function () {
  return gulp.src('./dev/signup_step1.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('signup_step2-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_signup_step2.js'])
    .pipe(concat('signup_step2.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('signup_step2-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css','./dev/CSS/p_signup_step2.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css'])
    .pipe(concat('signup_step2.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('signup_step2-inline', function () {
  return gulp.src('./dev/signup_step2.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('message-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_message.js'])
    .pipe(concat('message.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('message-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css'])
    .pipe(concat('message.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('message-inline', function () {
  return gulp.src('./dev/message.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('forgot-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_forgot.js'])
    .pipe(concat('forgot.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('forgot-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css',
                  './dev/CSS/p_forgot.css'])
    .pipe(concat('forgot.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('forgot-inline', function () {
  return gulp.src('./dev/forgot.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('reset-js', function () {
  return gulp.src(['./dev/JS/socket.js','./dev/JS/ws.js',
                  './dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_reset.js'])
    .pipe(concat('reset.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('reset-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css'])
    .pipe(concat('reset.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('reset-inline', function () {
  return gulp.src('./dev/reset.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('privacy-js', function () {
  return gulp.src(['./dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_privacy.js'])
    .pipe(concat('privacy.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('privacy-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css',
                  './dev/CSS/legal.css'])
    .pipe(concat('privacy.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('privacy-inline', function () {
  return gulp.src('./dev/privacy.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('tos-js', function () {
  return gulp.src(['./dev/JS/funcs.js','./dev/JS/go.js',
                  './dev/JS/is.js','./dev/JS/render.js','./dev/JS/cls.js',
                  './dev/JS/evnt.js','./dev/JS/elm.js',
                  './dev/JS/date.js','./dev/JS/msg.js',
                  './dev/JS/validation.js','./dev/JS/mw.js',
                  './dev/JS/signup.js','./dev/JS/login.js','./dev/JS/page.js',
                  './dev/JS/p_tos.js'])
    .pipe(concat('tos.js'))
    .pipe(gulpIf(prod,uglify()))
    .pipe(gulp.dest('./dev/_tmp/'));
});
gulp.task('tos-css', function () {
  return gulp.src(['./dev/CSS/beforeload.css',
                  './dev/CSS/i_reset.css','./dev/CSS/resp.css',
                  './dev/CSS/msg.css','./dev/CSS/msg_resp.css',
                  './dev/CSS/common.css',
                  './dev/CSS/modal.css','./dev/CSS/modal_resp.css',
                  './dev/CSS/anim.css','./dev/CSS/validation.css',
                  './dev/CSS/legal.css'])
    .pipe(concat('tos.css'))
    .pipe(autoprefixer({
            browsers: ['last 2 Chrome versions','last 2 Safari versions','last 2 ff versions', 'last 2 iOS versions'],
            cascade: false,
            remove: true
        }))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dev/_tmp'));
});
gulp.task('tos-inline', function () {
  return gulp.src('./dev/tos.html')
      .pipe(inline())
      .pipe(minifyHTML())
      .pipe(gulp.dest('./views/'));
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('all', function(livereload){
      sequence(
          'res-js','fl-js','fl2-js','partials-html',
          ['dash-js', 'dash-css'],
          'dash-html','dash-inline',
          // ['index_old-js', 'index_old-css'],
          // 'index_old-inline',
          ['index-js', 'index-css'],
          'index-inline',
          ['login-js', 'login-css'],
          'login-inline',
          ['signup_step1-js', 'signup_step1-css'],
          'signup_step1-inline',
          ['signup_step2-js', 'signup_step2-css'],
          'signup_step2-inline',
          ['message-js', 'message-css'],
          'message-inline',
          ['forgot-js', 'forgot-css'],
          'forgot-inline',
          ['reset-js', 'reset-css'],
          'reset-inline',
          ['privacy-js', 'privacy-css'],
          'privacy-inline',
          ['tos-js', 'tos-css'],
          'tos-inline','lr',
          livereload);
});
/*------------------------------------------------------------------------------------------------*/
gulp.task('lr', function () {
  'use strict';
  gulp.src('./views/*.html')
    .pipe(livereload());
});
gulp.task('watch', function () {
  'use strict';
  livereload.listen();
  gulp.watch(['./dev/JS/*.js','./dev/CSS/*.css','./dev/*.html'], ['all']);
});

gulp.task('default', ['watch']);
/*------------------------------------------------------------------------------------------------*/
gulp.task('css64', function () {
  return gulp.src('./dev/fonts/*.css')
    .pipe(cssBase64({
            maxWeightResource: 999999999
        }))
    .pipe(gulp.dest('./dev/fonts/css64/'));
});
/*------------------------------------------------------------------------------------------------*/
var site = 'https://www.trafficdefender.net';
var key = '';
gulp.task('mobile', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});
gulp.task('desktop', function () {
    return psi(site, {
        nokey: 'true',
        // key: key,
        strategy: 'desktop',
    }, function (err, data) {
        console.log(data.score);
        console.log(data.pageStats);
    });
});