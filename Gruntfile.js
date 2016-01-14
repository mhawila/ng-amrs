// Generated on 2015-06-29 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    bower: grunt.file.readJSON('bower.json'),
    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          // '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    uglify: {
      // Uses preparations done by useminPrepare
      options: {
        mangle: false
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'version.json',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*',
            'styles/medical-icons/{,*/}*.*',
            '!styles/medical-icons/fonts/*'
          ]
        }, {
          // FIXME: Very specific section for medical fonts, may need to refactor
          expand: true,
          cwd: '<%= yeoman.app %>/styles/medical-icons',
          dest: '<%= yeoman.dist %>/styles',
          src: ['fonts/*']
        },  {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      json: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/scripts/formentry/formschema',
            src: '*.json',
            dest: '<%= yeoman.dist %>/scripts/formentry/formschema'
          }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    revision: {
        options: {
          property: 'meta.revision',
          ref: 'HEAD',
          short: true
        }
    },

    'file-creator': {
        'tag-revision': {
          'app/version.json': function(fs, fd, done) {
            grunt.task.requires('revision');
            fs.writeSync(fd, JSON.stringify({
                version: grunt.config('bower.version'),
                revision: grunt.config('meta.revision'),
                date: grunt.template.today()
            }));
            done();
          }
        }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    
    jsonprettify: {
        options: {
          space: '\t'
        },
        tools: { src: ['package.json', 'bower.json'] }
    },
    
    release: {
        options: {
          npm: false,
          indentation: '\t', 
          tagMessage: 'Tagging version <%= version %>', //default: 'Version <%= version %>',
          additionalFiles: ['bower.json']
        }
    },
    
    gitcommit: {
        snapshot: {
            options: {
                message: 'Committing version change to SNAPSHOT version',
                noVerify: false,
                noStatus: false
            },
            files: {
                src: ['package.json']
            }
        }
    },
    
    gitpush: {
        snapshot: {
            options: {
                remote: 'origin'
            }
        }
    }
  });

  grunt.registerTask('maintenance-branch', function() {
      var npmProps = grunt.file.readJSON('package.json');
      var versionParts = _splitVersionNumber(npmProps.version);
      
      var branch = versionParts.major + '.' + versionParts.minor + '.x';
      
      //Create the maintenance branch.      
      grunt.log.writeln('Creating maintenance branch => ', branch);
      
      //Make native calls 
      var exec = require('sync-exec');
  
      var ret = exec('git branch ' + branch);
      grunt.log.writeln(ret.stdout);
      grunt.log.errorlns(ret.stderr);
      
      if(ret.status === 0) {
          grunt.log.writeln('Setting ', branch, ' to track upstream/', branch);
          ret = exec('git branch --set-upstream-to=origin/' + branch + ' ' + branch);
          grunt.log.writeln(ret.stdout);
          grunt.log.errorlns(ret.stderr);
      }
      
      grunt.log.write(exec('git status').stdout);
  });
  
  grunt.registerTask('snapshot', function(target) {
      //Here we update the master to snapshot version.
      var npmProps = grunt.file.readJSON('package.json');
      
      var vParts = _splitVersionNumber(npmProps.version);
      var minor = Number(vParts.minor);
      var patch = 0;
      if(target === 'minor') {
          minor++;
      } else {  //Patch version is to be upgraded
          if(!isNaN(vParts.patch)) {
              patch++;
          } else {
              // Try to get the initial part.
              var i=0;
              var num = '';
              while(i < vParts.patch.length) {
                  if(isNaN(vParts.patch[i])){
                      break;
                  }
                  num = num.concat(vParts.patch[i]);
                  i++;
              }
              patch = num.length>0 ? Number(num)+1 : 0;
          }
      }
      var snapshotVersion = vParts.major + '.' + minor + '.' + patch + '-SNAPSHOT';
      
      //Store it in config params for commit message
      grunt.config('snapshot.version', snapshotVersion);
      
      npmProps.version = snapshotVersion;
      grunt.file.write('package.json', JSON.stringify(npmProps));
      grunt.task.run(['jsonprettify']);
      
      //Commit the changes & push to remote
      grunt.task.run(['gitcommit:snapshot', 'gitpush:snapshot']);
  });
  
  grunt.registerTask('release-prepare', function(target) {
      // release
      if(target) {
          grunt.task.run('release:'+target);
      } else {
          grunt.task.run('release');
      }
      
      // build
      grunt.task.run('build');
      
      // Create maintenance branch if minor or major 
      if(target === 'major' || target === 'minor') {
          grunt.task.run('maintenance-branch');
      }
      
      // Update versions to snapshot.
      if(target === 'major' || target === 'minor') { //Both update minor version
          grunt.task.run('snapshot:minor');
      } else {
          grunt.task.run('snapshot');
      } 
  });
       
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'version',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('version', 'Update the build number', function() {
     grunt.task.run(['revision', 'file-creator']);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'version',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'copy:json'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
