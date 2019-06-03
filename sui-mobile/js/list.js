$(function () {
    'use strict';
  
    //下拉刷新页面
    $(document).on("pageInit", "#page-ptr", function(e, id, page) {
      var $content = $(page).find(".content").on('refresh', function(e) {
        // 模拟2s的加载过程
        setTimeout(function() {
          var cardHTML = '<div class="card">' +
            '<div class="card-header">标题</div>' +
            '<div class="card-content">' +
            '<div class="card-content-inner">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' +
            '</div>' +
            '</div>' +
            '</div>';
  
          $content.find('.card-container').prepend(cardHTML);
          // $(window).scrollTop(0);
          // 加载完毕需要重置
          $.pullToRefreshDone($content);
        }, 2000);
      });
    });
  
   
    $.init();
  });
  