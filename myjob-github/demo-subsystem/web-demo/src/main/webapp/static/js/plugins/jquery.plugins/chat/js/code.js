define([],function(){
    function EncodeUtf8(s1)
    {//字符转换为UTF-8编码
        var s = escape(s1);
        var sa = s.split("%");
        var retV ="";
        if(sa[0] != "")
        {
            retV = sa[0];
        }
        for(var i = 1; i < sa.length; i ++)
        {
            if(sa[i].substring(0,1) == "u")
            {
                retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));

            }
            else retV += "%" + sa[i];
        }

        return retV;
    }

    function Str2Hex(s)
    {
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for(var i = 0; i < s.length; i ++)
        {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += Dec2Dig(eval(n));

        }

        return digS;
    }

    function Dec2Dig(n1)
    {
        var s = "";
        var n2 = 0;
        for(var i = 0; i < 4; i++)
        {
            n2 = Math.pow(2,3 - i);
            if(n1 >= n2)
            {
                s += '1';
                n1 = n1 - n2;
            }
            else
                s += '0';

        }
        return s;

    }
    function Dig2Dec(s)
    {
        var retV = 0;
        if(s.length == 4)
        {
            for(var i = 0; i < 4; i ++)
            {
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    }

    function Hex2Utf8(s)
    {
        var retS = "";
        var tempS = "";
        var ss = "";
        if(s.length == 16)
        {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10,16);
            var sss = "0123456789ABCDEF";
            for(var i = 0; i < 3; i ++)
            {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i)+1)*8);
                retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
                retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
            }
            return retS;
        }
        return "";
    }

    //UTF-8编码的汉字转换为字符，特殊字符未处理，
    function chineseFromUtf8Url(strUtf8)
    {
        var   bstr   =   "";
        var   nOffset   =   0; //   processing   point   on   strUtf8

        if(strUtf8  == ""  )
            return   "";

        strUtf8   =   strUtf8.toLowerCase();
        nOffset   =   strUtf8.indexOf("%e");
        if(nOffset == -1 )
            return strUtf8;

        while(   nOffset   !=   -1   )
        {
            bstr   +=   strUtf8.substr(0,   nOffset);
            strUtf8   =   strUtf8.substr(nOffset,   strUtf8.length   -   nOffset);
            if(   strUtf8   ==   ""   ||   strUtf8.length   <   9   )       //   bad   string
                return   bstr;

            bstr     +=   utf8CodeToChineseChar(strUtf8.substr(0,   9));
            strUtf8   =   strUtf8.substr(9,   strUtf8.length   -   9);
            nOffset   =   strUtf8.indexOf("%e");
        }

        return   bstr   +   strUtf8;
    }

    function   unicodeFromUtf8(strUtf8)
    {
        var   bstr   =   "";
        var   nTotalChars   =   strUtf8.length;		//   total   chars   to   be   processed.
        var   nOffset   =   0;						//   processing   point   on   strUtf8
        var   nRemainingBytes   =   nTotalChars;	//   how   many   bytes   left   to   be   converted
        var   nOutputPosition   =   0;
        var   iCode,   iCode1,   iCode2;			//   the   value   of   the   unicode.

        while   (nOffset   <   nTotalChars)
        {
            iCode   =   strUtf8.charCodeAt(nOffset);
            if   ((iCode   &   0x80)   ==   0)		//   1   byte.
            {
                if   (   nRemainingBytes   <   1   ) //   not   enough   data
                    break;

                bstr   +=   String.fromCharCode(iCode   &   0x7F);
                nOffset   ++;
                nRemainingBytes   -=   1;
            }
            else   if   ((iCode   &   0xE0)   ==   0xC0)		//   2   bytes
            {
                iCode1   =     strUtf8.charCodeAt(nOffset   +   1);
                if   (   nRemainingBytes   <   2   ||			//   not   enough   data
                    (iCode1   &   0xC0)   !=   0x80   )			//   invalid   pattern
                {
                    break;
                }

                bstr   +=   String.fromCharCode(((iCode   &   0x3F)   <<   6)   |   (   iCode1   &   0x3F));
                nOffset   +=   2;
                nRemainingBytes   -=   2;
            }
            else   if   ((iCode   &   0xF0)   ==   0xE0) //   3   bytes
            {
                iCode1   =     strUtf8.charCodeAt(nOffset   +   1);
                iCode2   =     strUtf8.charCodeAt(nOffset   +   2);
                if   (   nRemainingBytes   <   3   || //   not   enough   data
                    (iCode1   &   0xC0)   !=   0x80   || //   invalid   pattern
                    (iCode2   &   0xC0)   !=   0x80   )
                {
                    break;
                }

                bstr   +=   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |
                    ((iCode1   &   0x3F)   <<     6)   |
                    (iCode2   &   0x3F));
                nOffset   +=   3;
                nRemainingBytes   -=   3;
            }
            else //   4   or   more   bytes   --   unsupported
                break;
        }

        if   (nRemainingBytes   !=   0)
        {
            //   bad   UTF8   string.
            return   "";
        }

        return   bstr;

    }

    function   utf8CodeToChineseChar(strUtf8)
    {
        var   iCode,   iCode1,   iCode2;
        iCode   =   parseInt("0x"   +   strUtf8.substr(1,   2));
        iCode1   =   parseInt("0x"   +   strUtf8.substr(4,   2));
        iCode2   =   parseInt("0x"   +   strUtf8.substr(7,   2));

        return   String.fromCharCode(((iCode   &   0x0F)   <<   12)   |   ((iCode1   &   0x3F)   <<     6)  |  (iCode2   &   0x3F));
    }

    /*
     * Javascript base64_encode() base64加密函数
     用于生成字符串对应的base64加密字符串
     * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
     * @param string str 原始字符串
     * @return string 加密后的base64字符串
     */
    function base64_encode(str){
        var c1, c2, c3;
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var i = 0, len= str.length, string = '';

        while (i < len){
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len){
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                string += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len){
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                string += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            string += base64EncodeChars.charAt(c3 & 0x3F)
        }
        return string
    }
    /*
     * Javascript base64_decode() base64解密函数
     用于解密base64加密的字符串
     * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
     * @param string str base64加密字符串
     * @return string 解密后的字符串
     */
    function base64_decode(str){
        var c1, c2, c3, c4;
        var base64DecodeChars = new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
            58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
            7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
            -1, -1
        );
        var i=0, len = str.length, string = '';

        while (i < len){
            do{
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
            } while (
                i < len && c1 == -1
                );

            if (c1 == -1) break;

            do{
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
            } while (
                i < len && c2 == -1
                );

            if (c2 == -1) break;

            string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            do{
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return string;

                c3 = base64DecodeChars[c3]
            } while (
                i < len && c3 == -1
                );

            if (c3 == -1) break;

            string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            do{
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return string;
                c4 = base64DecodeChars[c4]
            } while (
                i < len && c4 == -1
                );

            if (c4 == -1) break;

            string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
        }
        return string;
    }

    var longTOBytes = function(len){

        var f1 = (len & 0x000000ff);
        var f2 = (len & 0x0000ff00) >> 8;
        var f3 = (len & 0x00ff0000) >> 16;
        var f4 = (len & 0xff000000) >> 24;

        return [f1,f2,f3,f4];
    }
})
