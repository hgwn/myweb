module.exports=function(s){"use strict";s.initConfig({pkg:s.file.readJSON("package.json"),language:s.option("lang")||"en",html2js:{dist:{options:{module:null,base:"."},files:[{expand:!0,src:["template/*.html"],ext:".html.js"}]}},less:{development:{options:{paths:["./src"],interrupt:!0},tasks:["less:development"],files:{"./src/nestedCombobox.css":"./src/nestedCombobox.less"}}},watch:{less:{files:["./src/*"],tasks:["less:development"],options:{interrupt:!0}}}}),s.loadNpmTasks("grunt-contrib-less"),s.loadNpmTasks("grunt-contrib-watch"),s.loadNpmTasks("grunt-html2js"),s.registerTask("before-test",["html2js"]),s.registerTask("watch",["before-test","watch"])};