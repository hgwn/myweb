function  MainView(newDlg, openDlg, workplace){
    this.m_newdlg = newDlg;
    this.m_opendlg = openDlg;
    this.m_workplace = workplace;
    this.m_bWork = false;
}
function getPath(obj,fileQuery){ 
    var file =fileQuery.files[0];  
    var reader = new FileReader();  
    reader.onload = function(e){ 
        obj.setAttribute("src",e.target.result) 
    } 
    reader.readAsDataURL(file);  
} 
MainView.prototype = {
    openNewDialog: function(){
        var result = false;
        
        this.closeOpenDialog();
        result = this.endWork();
        this.m_newdlg.open(MsgDispatch.temptypes);
        return result;
        
    },
    closeNewDialog: function(action){
        if(action == "ok"){
            if(!this.m_newdlg.validate()){
                return false;
            }
            if(NewDialog.m_backUrL!=" "&&NewDialog.m_backUrlmsg!=null){
            		$.messager.show({title:'系统信息', msg: NewDialog.m_backUrlmsg});
            		return false
            	//$.messager.show({title:'系统信息', msg: '稍等图片上传完'});
            }
            else{
                this.m_newdlg.close();
                this.beginWork(this.m_newdlg.getData());
            }
        }
        else if(action == "cancel"){
            this.openOpenDialog();
            this.m_newdlg.close();
        }
        else{
            this.m_newdlg.close();
        }
        
        return true;
    },
    openOpenDialog: function(){
        var result = false;
        
        this.closeNewDialog();
        result = this.endWork();
        
        MsgDispatch.sendMessage("onOpenDialog",["{}"], function(param, sender){
            sender.m_opendlg.open(MsgDispatch.temptypes, param);
        }, this);
        
        return result;
    },
    closeOpenDialog: function(){
        this.m_opendlg.close();
    },
    openFile: function(){
        this.m_opendlg.openFile();
    },
    deleteFile: function(index){
        this.m_opendlg.deleteFile(index);
    },
    
    isWork: function(){
        return this.m_bWork;
    },
    beginWork: function(tempinfo, dataitem){
    	
        this.m_bWork = true;
        this.closeNewDialog();
        this.closeOpenDialog();
        FileMenu.begin();
        this.m_workplace.show();
        this.m_workplace.setData(tempinfo, dataitem);
    },
    endWork: function(){
        this.m_bWork = false;
        FileMenu.end();
        this.m_workplace.endWork();

        return true;
    },
    needSave: function(){
        return this.m_workplace.needSave();
    },
    save: function(){
        this.m_workplace.saveData();
    },
    addDataItem: function(point, tempitem){
        this.m_workplace.addDataItem(point, tempitem);
    }
}