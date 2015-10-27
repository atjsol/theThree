module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: true
            },
            client: {
                src: ["client/**/*.js"]
            },
            server: {
                src: [
                    "**/*.js",
                    "!node_modules/**",
                    "!bower_components/**",
                    "!client/**",
                    "!public/**",
                    "!test/**"
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
            ],
            options: {
                js: {
                    indentSize:2,
                    maxPreserveNewlines: 3,
                    preserveNewlines: true
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

    grunt.registerTask("format", ["jsbeautifier"]);
};
