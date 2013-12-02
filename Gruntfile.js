module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg:grunt.file.readJSON('package.json'),

        shell: {
            startNginx: {
                command: "sudo nginx -c `pwd`/nginx.conf"
            },
            stopNginx: {
                options: {
                    callback: function( err, stdout, stderr, cb ) {
                        console.log("Stopping Nginx as sudo - enter your user's password");
                        console.log(stdout);
                        console.log(stderr);
                        cb();
                    }
                },
                command: "sudo pkill nginx"
            },
            testRuby: {
                options: {
                    callback: function( err, stdout, stderr, cb ) {
                        var output = stdout.split("\n");
                        if( output[0] === undefined || output[0] === "" ) {
                            console.log("You need to install Ruby");
                            return false;
                        } else {
                            console.log("You have Ruby installed here: [" + output[0] + "]");
                        }
                        cb();

                    }
                },
                command: "which ruby"
            },
            testSass: {
                options: {
                    callback: function( err, stdout, stderr, cb ) {
                        var output = stdout.split("\n");
                        if( output[0] === undefined || output[0] === "" ) {
                            console.log("You need to install Sass");
                            return false;
                        } else {
                            console.log("You have Sass installed here: [" + output[0] + "]")
                        }
                        cb();

                    }
                },
                command: "which sass"
            },
            compileFoundation: {
                options: {
                    callback: function( err, stdout, stderr, cb ) {
                        console.log(stdout);
                        cb();
                    }
                },
                command: "cd <%= pkg.paths.sourceDirectory %>/lib/foundation && npm install && grunt test"
            },
            buildVersion : {
                options: {
                    callback: function( err, stdout, stderr, cb ) {
                        console.log(stdout);
                        cb();

                    }
                },
                command: [
                    'rm src/main/resources/buildinfo.txt',
                    'touch src/main/resources/buildinfo.txt',
                    'echo `date` >> src/main/resources/buildinfo.txt',
                    "echo 'Built from branch: ' `git rev-parse --abbrev-ref HEAD` >> src/main/resources/buildinfo.txt",
                    "cat src/main/resources/buildinfo.txt"
                ].join("&&")
            },
            renameCoverage: {
                options: {
                    callback: function( err, stdout, stderr, cb) {
                        console.log("Renaming Coverage Reports...");
                        cb();
                    }
                },
                command: [
                    "cd target/coverage",
                    "ls | sed -n 's/^Chrome.*/mv \"&\" Chrome/gp'  | sh"
                ].join("&&")

            }
        },
        karma:{
            unit:{
                configFile:'karma.conf.js'
            },
            build:{
                configFile:'karma.conf.js',
                singleRun:true,
                browsers:['Chrome']
            }
        },
        banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        clean: {
            clean: ['<%= pkg.paths.buildOutputDirectory %>'],
            bower: ['<%= pkg.paths.sourceDirectory %>/lib/']
        },

        copy: {
            browser: {
                files: [
                    {
                        expand:true,
                        cwd:'<%= pkg.paths.sourceDirectory %>',
                        src:[
                            '**/*'
                        ],
                        dest: '<%= pkg.paths.buildOutputDirectory %>/browser/en'
                    }
                ]
            }
        },

        bower:{
            install:{
                options:{
                    targetDir:'<%= pkg.paths.libraries %>',
                    cleanup:true
                }
            }
        },

        concat:{
            options:{
                banner:'<%= banner %>',
                stripBanners:true
            },
            dist:{
                src:['lib/<%= pkg.name %>.js'],
                dest:'dist/<%= pkg.name %>.js'
            }
        },
        uglify:{
            options:{
                banner:'<%= banner %>'
            },
            dist:{
                src:'<%= concat.dist.dest %>',
                dest:'dist/<%= pkg.name %>.min.js'
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'src/main/resources/web-server.js',
                    args: [
                        '3000',
                        __dirname + '/src/main/resources/'
                    ],
                    nodeArgs: ['--debug'],
                    cwd: __dirname,
                    logConcurrentOutput: true
                }
            },
            built: {
                options: {
                    file: 'target/browser/en/web-server.js',
                    args: [
                        '4000',
                        __dirname + '/src/main/resources/'
                    ],
                    nodeArgs: ['--debug'],
                    cwd: __dirname,
                    logConcurrentOutput: true
                }
            }
        },
        open : {
            app : {
                path: 'http://127.0.0.1:4000/',
                app: 'Google Chrome'
            },
            src : {
                path: 'http://127.0.0.1:3000/',
                app: 'Google Chrome'
            }
        },
        concurrent: {
            dev: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['nodemon', 'open']
            }
        }
    });

    grunt.task.registerMultiTask('buildDependencies', function() {
        grunt.log.writeln("Building for project dependency: " + this.target);

        grunt.util.spawn({
            cmd: 'grunt',
            args: ['test']
        }, function(error, result, code){

        })
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-karma');



    /**
     * We have some external dependencies in our build. This should ensure
     * both are on your machine before letting the build complete.
     *
     * 1) Ruby is needed for SASS
     * 2) SASS is needed to compile CSS from SCSS
     */
    grunt.registerTask('verify', ['shell:testRuby', 'shell:testSass']);

    /**
     * Phase 2 is to resolve dependencies
     * - Right now we use Bower to do so.
     */
    grunt.registerTask('resolve', ['bower:install', 'shell:compileFoundation']);

    /**
     * Phase 3 is to copy resources from source directories to the target
     * -
     */
    grunt.registerTask('copyResources', ['shell:buildVersion', 'copy']);

    /**
     * Phase 4 is to run tests against the pre-copied source and post-copied source
     */
    grunt.registerTask('runTests', ['karma:build', 'shell:renameCoverage']);

    /**
     * Phase 5 is to deploy and start the application
     */
    grunt.registerTask('deploy', ['concurrent']);

    // Default task.
    grunt.registerTask('default', ['verify', 'clean', 'resolve', 'copyResources', 'runTests', 'deploy']);

    grunt.registerTask('stop', ['shell:stopNginx']);
    grunt.registerTask('start', ['shell:startNginx']);

    grunt._tasks["nameYouWant"]

};

