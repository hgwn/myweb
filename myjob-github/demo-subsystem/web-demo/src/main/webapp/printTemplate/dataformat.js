DataFormat = {
    root:0,  			//列表根ID
    m_tempitemFormat: {
    	itemid: 'itemid',           //模板项目录ID
        pid: 'pid',             //父节点ID
        type:  "templatetype",
        param: 'linkparam',     //数据库字段名，如果是ID,则复制一份本模板项的数据param的目录
        title: 'itemname'       //名字
    },
    m_tempinfoFormat: {
        tempid: 'tempid',                       //模板ID
        tempname: 'tempname',                   //模板名称
        temptype: 'temptype',                   //模板类型
        templatetypeid:'templatetypeid',       //模版类型ID
        //companyid: 'logisticsid',               //公司ID
        //companyname: 'logisticsname',           //公司名称
        width: 'width',                         //纸张宽度
        height: 'hight',                        //纸张高度
        pictureurl: 'pictureurl',                     //背景图片,以字符串形式存放
        crc: 'crc',                             //图片的CRC校验码
        createdby: 'createdby'                        //作者
    },
    m_dataitemFormat: {
    	dataid: 'dataid',
        dataname: 'dataname',
        displayname: 'displayname',
        tempid: 'tempid',
        groupid: 'groupid',
        datatype: 'datatype',
        typeparam: 'typeparam',
        linkparam: 'linkparam',
        x: 'x',
        y: 'y',
        cx: 'cx',
        cy: 'cy',
        intervals:'intervals',
        fontsize:"fontsize",
        fontcolor:"fontcolor",
        action:"nothing",
        isprint: 'isprint'
    },
    formatData: function(format, data){
        if(!data){	
            return data;
        }
        for(var i = 0; i < data.length; ++i){
            var dataCache = {};
            for(var key in format){
                if(key == format[key]){
                    continue;
                }
                
                if(format[key] in data[i]){
                    dataCache[key] = data[i][format[key]];
                    delete data[i][format[key]];
                }
            }
            
            for(var key in dataCache){
                data[i][key] = dataCache[key];
            }
        }
        return data;
    },
    recoverData: function(format, data){
        if(!data){
            return data;
        }
        
        var result = [];

        for(var i = 0; i < data.length; ++i){
            var dataCache = {};
            for(var key in data[i]){
                if(key in format){
                    dataCache[format[key]] = data[i][key];
                }
                else{
                    dataCache[key] = data[i][key];
                }
            }
            result.push(dataCache);
        }
        return result;
    },
    formatTempItem: function(data){ 
        return this.formatData(this.m_tempitemFormat, data);
    },
    formatTempInfo: function(data){
        return this.formatData(this.m_tempinfoFormat, [data])[0];
    },
    recoverTempInfo: function(data){
        return this.recoverData(this.m_tempinfoFormat, [data])[0];
    },
    formatDataItem: function(data){
        return this.formatData(this.m_tempinfoFormat, data);
    },
    recoverDataItem: function(data){
        return this.recoverData(this.m_tempinfoFormat, data);
    }
}