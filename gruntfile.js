module.exports=function (grunt) {
    grunt.initConfig({
        /*uglify:{
            options: {
                compress: {
                    drop_console: true
                }
            },
            development: {
                files: {
                    'app/controllers/account.min.js': 'app/controllers/account.js'
                }
            }
        },*/
        nodemon: {
            //tasks: ['uglify'],
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 8000
                    },
                    cwd: __dirname
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.option('force', true)
    grunt.registerTask('default', ['nodemon'])

}

