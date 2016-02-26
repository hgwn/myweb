function Accordion(obj){
    this.m_object = obj;
    this.m_data = {};
    
    this.dragNode = null;
    this.lastID = null; //解决双击拖动问题
}
Accordion.prototype = {
    setData: function(data){
        var pThis = this;
        //draggable ready
        var onadd = this.m_object.accordion("options").onAdd;
        this.m_object.accordion({onAdd: function(title,index){
            $(this).accordion("getPanel", index).find(".easyui-tree").each(function(){
                $(this).attr("oncontextmenu", "self.event.returnValue=false;");
                $(this).tree({
                    fit:true,
                    dnd:true,
                    onSelect: function(node){
                        MsgDispatch.onTempItemSelect(node, pThis.m_data[node.id]);
                    },
                    onBeforeDrag: function(node){
                        pThis.dragNode = node;
                        
                        if(pThis.lastID == node.id){
                            return false;
                        }
                        pThis.lastID = node.id;
                        return true;
                    },
                    onDragOver:function(){
                        return false;
                    },
                    onLoadSuccess:function(){
                        $(".tree-node").draggable({                           
                            deltaX: null,
                            deltaY: null,
                            proxy: function(source){
                                var value = $('<div class="dataitem dataitem-focus">' + pThis.dragNode.text + '</div>');
                                value.hide();
                                value.appendTo('body');
                                return value;
                            },
                            onStartDrag: function(e){
                                $(this).draggable('proxy').addClass('dataitem-drag');
                                $(this).draggable('options').cursor='not-allowed';
                            },
                            onStopDrag: function(e){
                                setTimeout(function(){
                                    pThis.lastID = null;
                                }, 500);
                            
                                $(this).draggable('options').cursor='pointer';
                                
                                var node = pThis.dragNode;
                                MsgDispatch.onTempItemDragOver(node, e, pThis.m_data[node.id]);
                            }
                        });
                    }
                });
            });
        }});
        
        //添加父节点,缓存子节点
        var childrenCache = {};	
        for(var i = 0; i < data.length; ++i){
            var row = data[i];
           
            //保存数据
            this.m_data[row[DataFormat.m_tempitemFormat.itemid]] = row;
            if(!row[DataFormat.m_tempitemFormat.pid] || row[DataFormat.m_tempitemFormat.pid] == DataFormat.root){
                // 父节点,添加accordion
                this.m_object.accordion("add",{
                    selected: false,
                    title: row["title"],
                    content: '<ul id="acctree' + row[DataFormat.m_tempitemFormat.itemid] + '" class="easyui-tree"></ul>'
                });
            }
            else{
                //缓存子节点
                if(!(row[DataFormat.m_tempitemFormat.pid] in childrenCache)){
                    childrenCache[row[DataFormat.m_tempitemFormat.pid]] = [];
                }
                childrenCache[row[DataFormat.m_tempitemFormat.pid]].push({
                    id: row[DataFormat.m_tempitemFormat.itemid],
                    text: row["title"],
                    attributes: row
                });
            }
        }
        //添加子节点
        for(var i in childrenCache){
            if($("#acctree" + i).length == 0){
                continue;
            }
            
            $("#acctree" + i).tree("loadData", childrenCache[i]);
        }
        
        //recover
        this.m_object.accordion({onAdd: onadd});
    },
    getTempTypes: function(){
        var data = this.m_data;
        
        var temptypes = [];
        for(var key in data){
            if(data[key].pid == DataFormat.root){
                temptypes.push(data[key]);
            }
        }
        return temptypes;
    }
}