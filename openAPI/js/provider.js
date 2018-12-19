var DataProvider= {
    
    localStore:{
    
        save:function(key,obj,keepDays){
         
            var jsonStr = JSON.stringify(obj);
         
         
            $.cookie(key, 
                jsonStr, 
                {
                    expires : keepDays,
                    path : '/'
                }
                );
              
        },
        
        get:function(key){
            return DataProvider.localStore.load(key);
        },
        
     
        load:function(key){
         
            var jsonStr = $.cookie(key);
         
            var obj = null;
            if(jsonStr){
             
                obj = JSON.parse(jsonStr);
             
            }
        
            return obj;
         
        },
        loadAsString:function(key){
        
            return $.cookie(key);
        }, 
        remove:function(key){
         
            $.cookie(key, null, {
                expires : -1,
                path : '/'
            });
        },
     
    
        syncFrom:function(key,url,params,callback,keepDays){
        
        
            $.ajax({
                type: 'POST',
                url: url,
                data: params ||{},
                success: function(data){
                
              
                    if(data){
                        if( !keepDays){
                            keepDays = 1
                        };  
                        DataProvider.localStore.remove(key);
                        DataProvider.localStore.save(key, data, keepDays); 
                    
                    }
                },
                dataType: 'json',
                async:false
            });
         
       
         
         
        },
        
        syncTo:function(key,url,params,callback){
            
            var data =DataProvider.localStore.loadAsString(key);
            
            if(data){
                
                params[key] = data; 
                
                $.post(url, params, callback, 'json'); 
                
            }
            
        }
    
    },
    
    memStore:{
        
        data:{},
        save:function(key,val){
           
            DataProvider.memStore.data[key] = val;
           
        },
        
        get:function(key){
            
            return DataProvider.memStore.data[key]; 
            
        },
        
        remove:function(key){
            DataProvider.memStore.data[key] = undefined;
        }
    },
    
   
    createStore:function(opt){
        
      
        function RemoteStore(opt){
          
            this.opt = {};
            $.extend(this.opt,opt) ;
           
            this.loaded = false;
            
        }
        
        //save back to server
        RemoteStore.prototype.save = function(callback){
          
          var url = this.opt.saveUrl;
          
          $.post(url, this.data, function(data){
                     
                if(callback){
                    
                    callback(data);
                }
                    
                  
            }, 'json');
            
        }
        
        //maybe unsync load
        RemoteStore.prototype.get = function(callback){
           
            if(this.loaded){
                
                callback(this.data);
            }else{
               
               this.refresh(callback);
            }
          
            
        }
        
        RemoteStore.prototype.refresh=function(callback){
            
            var url = this.opt.getUrl;
            var params = this.opt.params;
             
            $this = this; 
            $.post(url, params, function(data){
               
                $this.loaded = true;
                
                $this.data = data;
                    
                if(callback){
                     
                
                    callback(data);
                }
                    
                  
            }, 'json');
            
        }
        
        
        return new RemoteStore(opt);
        
        
    }
    
    
    
}


