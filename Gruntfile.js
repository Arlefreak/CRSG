module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'js/lib/Phaser.js',
                    'js/lib/Helpers.js',
                    'js/lib/Underscore.js',
                    'js/lib/SolverNode.js',
                    'js/lib/Solver.js',
                    'js/src/Prefabs/Grid.js',
                    'js/src/Prefabs/GridLayer.js',
                    'js/src/Prefabs/Enemy.js',
                    'js/src/Prefabs/Fog.js',
                    'js/src/States/Boot.js',
                    'js/src/States/Preloader.js',
                    'js/src/States/MainMenu.js',
                    'js/src/States/Tutorial.js',
                    'js/src/States/Credits.js',
                    'js/src/States/LeaderBoards.js',
                    'js/src/States/Play.js',
                    'js/src/Main.js'
                ],
                dest: 'build/CRSG.js',
            },
        },
        replace: {
            main: {
                src: ['build/CRSG.js'], // source files array (supports minimatch)
                dest: 'build/CRSG.js', // destination directory or file
                replacements: [{
                    from: 'js/res/', // string replacement
                    to: '/static/Games/CRSG/assets/'
                }]
            }
        },
        uglify: {
            build: {
                src: 'build/CRSG.js',
                dest: 'build/CRSG.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'js/res/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/assets/'
                }]
            }
        },
        clean: {
            build: {
                src: ['build']
            },
            server: {
                options: {
                    force: true
                },
                src: ['../../../Web/Django/arlefreaksite/portfolio/static/Games/CRSG/**/*',
                    '!../../../Web/Django/arlefreaksite/portfolio/static/Games/CRSG/CRSG400x200.png',
                    '!../../../Web/Django/arlefreaksite/portfolio/static/Games/CRSG/CRSG1024x300.png',
                    '!../../../Web/Django/arlefreaksite/portfolio/static/Games/CRSG/CRSG.css'
                ]
            },
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'js/res/',
                    src: ['**/*.{json,mp3,ogg,wav}'],
                    dest: 'build/assets/'
                }, {
                    expand: true,
                    cwd: 'js/res/',
                    src: ['fonts/**'],
                    dest: 'build/assets/'
                }, ]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['**', '!CRSG.js', '!index.html'],
                    dest: '../../../Web/Django/arlefreaksite/portfolio/static/Games/CRSG/'
                }]
            }
        },
        watch: {
            scripts: {
                files: 'js/**/*.js',
                tasks: ['build']
            },
            images: {
                files: '**/*.{png,jpg,gif}',
                tasks: ['build']
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.', ['concat', 'replace', 'uglify']
    );

    grunt.registerTask(
        'images',
        'Compiles the JavaScript files.', ['imagemin']
    );


    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory.', ['scripts', 'images', 'copy', 'clean:server', 'copy:server']
    );

    grunt.registerTask(
        'default',
        'Watches the project for changes, automatically builds them and runs a server.', ['build', 'watch']
    );
};