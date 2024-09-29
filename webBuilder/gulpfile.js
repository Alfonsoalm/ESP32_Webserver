const gulp = require('gulp');
const fs = require('fs');
const gzip = require('gulp-gzip');
const flatmap = require('gulp-flatmap');
const path = require('path');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const pump = require('pump');
const imagemin = require('gulp-imagemin-changba');
const log = require('fancy-log');


// minificar las imagenes y convertirlas a gz
function imgToGz(){
    return gulp.src('../ESP32_FRONT/assets/img/*.*')
        .pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
        .pipe(gulp.dest('./dist'))
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('./dist/assets/img'))
}
// Convertir img a binario *.h
function imgToh(){
    return toH('./dist/assets/img/*.*'); // función para convertir a binario y poner los archivos en platformio
}
// minificar y convertir a gzip los html
function htmlToMinGz(){
    return gulp.src('../ESP32_FRONT/*.htm*')
        .pipe(htmlmin({
            removeComments: true, 
            collapseWhitespace: true, 
            minifyJS: true, 
            minifyCSS: true,
            minifyURLs: true
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('./dist'))
}
// convertir los html a binario *.h
function htmlToh(){
    return toH('./dist/*.gz')
}
// minificar los js
function jsToMinify(cb){
    pump([
        gulp.src('../ESP32_FRONT/assets/js/*.js'),
        uglify({
            mangle: false,
            output:{
                beautify:false,
                comments: false
            }
        }),
        gulp.dest('./dist/assets/js')
    ],
    cb
    );
}
// convertir los js a gz
function jsToGz(){
    return gulp.src('./dist/assets/js/*.js')
        .pipe(gzip({
            append: true
        }))
        .pipe(gulp.dest('./dist/assets/js'))
}
// convertir los archivos js.gz a binario  *.h
function jsToh(){
    return toH('./dist/assets/js/*.gz')
}
// convertir a min los css y a GZ
function cssToMinGz(){
    return gulp.src('../ESP32_FRONT/assets/css/*.css')
        .pipe(gulp.dest('./dist/assets/css/'))
            .pipe(cssmin())
            .pipe(gzip({
                append: true
            }))
        .pipe(gulp.dest('./dist/assets/css/'))
}
// convertir los css a binario *.h
function cssToh(){
    return toH('./dist/assets/css/*.gz')
}
// convertir las fuentes a gz
function fontsToGz(){
    return gulp.src('../ESP32_FRONT/assets/css/fonts/*.*')
        .pipe(gulp.dest('./dist/assets/css/fonts/'))
            .pipe(gzip({
                append: true
            }))
        .pipe(gulp.dest('./dist/assets/css/fonts/'))
}
// pasar fuentes a binario *.h
function fontsToh(){
    return toH('./dist/assets/css/fonts/*.gz')
}
// Función general para convertir todo a h en el proyecto de platformio
function toH(pathname){
    return gulp.src(pathname)
        .pipe(flatmap(function(stream, file){
            const filename = path.basename(file.path);
            const wstream = fs.createWriteStream('../ESP32_BACK/src/webh/'+filename+'.h');
            wstream.on('error', function(err){
                log(err); 
            });
            const data = file.contents;
            wstream.write("#define " + filename.replace(/\.|-/g, "_") + "_len " + data.length + "\n");
            wstream.write("const uint8_t " + filename.replace(/\.|-/g, "_") + "[] PROGMEM = {")
            // crear la data para PROGMEM
            for (i = 0; i < data.length; i++) {
                if (i % 1000 == 0) wstream.write("\n");
                wstream.write('0x' + ('00' + data[i].toString(16)).slice(-2));
                if (i < data.length - 1) wstream.write(',');
            }
            wstream.write("\n};")
            wstream.end();
            return stream;
        }));
}
// Ejecutar de manera global la creacion de todo
exports.build = gulp.series(
    imgToGz,
    htmlToMinGz,
    jsToMinify,
    jsToGz,
    cssToMinGz,
    fontsToGz,
    gulp.parallel(imgToh, htmlToh, jsToh, cssToh, fontsToh)
)

