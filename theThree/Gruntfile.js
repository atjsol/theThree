module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                funcscope: true,
                latedef: "nofunc",
                maxcomplexity: 10,
                maxdepth: 3,
                maxparams: 10,
                nonbsp: true,
                shadow: true,
                undef: true
            },
            client: {
                src: ["client/**/*.js"],
                options: {
                    browser: true,
                    browserify: true,
                    devel: true,
                    
                    globals: {
                        Promise: true,
                        Response: true,
                        Map: true
                    }
                }
            },
            server: {
                src: [
                    "**/*.js",
                    "!node_modules/**",
                    "!bower_components/**",
                    "!client/**",
                    "!public/**",
                    "!dist/**"
                ],
                options: {
                    node: true
                }
            }
        },
        jsbeautifier: {
            files: [
                "client/**/*.js",
                "!node_modules/**",
                "!bower_components/**",
                "!dist/**"
            ],
            options: {
                js: {
                    indentSize:2
                },
                html: {
                    indentSize:2
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsbeautifier");

    grunt.registerTask("default", ["jshint"]);

    grunt.registerTask("format", ["jshint:client", "jsbeautifier"]);
};