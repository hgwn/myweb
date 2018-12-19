;(function($) {
   
   
      $.fn.simpleTab=function(options,params){
            var defopt = {
                selected:"other",
                style:{
                    cursor: "pointer"
                },
                grouped:true,
                item:"ul > li"
            };
					   
            var opt = {};
            var preTab = {};
        		
            $.extend(opt,defopt,options);   
        	
            this.each(function() {
                var $this = $(this);
                
                var lis = $this.find(opt.item);
				
                lis.click(function(){
                    if(preTab == $(this)){
                        return;
                    } 
                    lis.removeClass(opt.selected);
                    $(this).addClass(opt.selected);
					
                    if(opt.grouped){
                        if(preTab == {}){
                            preTab = $(this);
                        }else{
                            $(preTab).removeClass(opt.selected);
                            preTab = $(this);
                        }
                    }
                    
                    
                    if(opt.onclick){
                        opt.onclick(this,params);
                    }
                });
                
                
            });
        	
      } ;
        
   

})(jQuery);