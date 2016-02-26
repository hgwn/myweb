function ByteBuffer(t,e){}ByteBuffer.prototype.array,ByteBuffer.prototype.offset,ByteBuffer.prototype.markedOffset,ByteBuffer.prototype.length,ByteBuffer.prototype.littleEndian,ByteBuffer.VERSION,ByteBuffer.DEFAULT_CAPACITY=32,ByteBuffer.LITTLE_ENDIAN=!0,ByteBuffer.BIG_ENDIAN=!1,ByteBuffer.allocate=function(t,e){},ByteBuffer.wrap=function(t,e,f){},ByteBuffer.isByteBuffer=function(t){},ByteBuffer.prototype.LE=function(t){},ByteBuffer.prototype.BE=function(t){},ByteBuffer.prototype.resize=function(t){},ByteBuffer.prototype.slice=function(t,e){},ByteBuffer.prototype.sliceAndCompact=function(t,e){},ByteBuffer.prototype.ensureCapacity=function(t){},ByteBuffer.prototype.flip=function(){},ByteBuffer.prototype.mark=function(t){},ByteBuffer.prototype.reset=function(){},ByteBuffer.prototype.clone=function(){},ByteBuffer.prototype.copy=function(){},ByteBuffer.prototype.remaining=function(){},ByteBuffer.prototype.capacity=function(){},ByteBuffer.prototype.compact=function(){},ByteBuffer.prototype.destroy=function(){},ByteBuffer.prototype.reverse=function(){},ByteBuffer.prototype.append=function(t,e){},ByteBuffer.prototype.prepend=function(t,e){},ByteBuffer.prototype.writeInt8=function(t,e){},ByteBuffer.prototype.readInt8=function(t){},ByteBuffer.prototype.writeByte=function(t,e){},ByteBuffer.prototype.readByte=function(t){},ByteBuffer.prototype.writeUint8=function(t,e){},ByteBuffer.prototype.readUint8=function(t){},ByteBuffer.prototype.writeInt16=function(t,e){},ByteBuffer.prototype.readInt16=function(t){},ByteBuffer.prototype.writeShort=function(t,e){},ByteBuffer.prototype.readShort=function(t){},ByteBuffer.prototype.writeUint16=function(t,e){},ByteBuffer.prototype.readUint16=function(t){},ByteBuffer.prototype.writeInt32=function(t,e){},ByteBuffer.prototype.readInt32=function(t){},ByteBuffer.prototype.writeInt=function(t,e){},ByteBuffer.prototype.readInt=function(t){},ByteBuffer.prototype.writeUint32=function(t,e){},ByteBuffer.prototype.readUint32=function(t){},ByteBuffer.prototype.writeInt64=function(t,e){},ByteBuffer.prototype.readInt64=function(t){},ByteBuffer.prototype.writeUint64=function(t,e){},ByteBuffer.prototype.readUint64=function(t){},ByteBuffer.prototype.writeFloat32=function(t,e){},ByteBuffer.prototype.readFloat32=function(t){},ByteBuffer.prototype.writeFloat=function(t,e){},ByteBuffer.prototype.readFloat=function(t){},ByteBuffer.prototype.writeFloat64=function(t,e){},ByteBuffer.prototype.readFloat64=function(t){},ByteBuffer.prototype.writeDouble=function(t,e){},ByteBuffer.prototype.readDouble=function(t){},ByteBuffer.prototype.writeLong=function(t,e){},ByteBuffer.prototype.readLong=function(t){},ByteBuffer.prototype.writeVarint32=function(t,e){},ByteBuffer.prototype.readVarint32=function(t){},ByteBuffer.prototype.writeZigZagVarint32=function(t,e){},ByteBuffer.prototype.readZigZagVarint32=function(t){},ByteBuffer.prototype.writeVarint64=function(t,e){},ByteBuffer.prototype.readVarint64=function(t){},ByteBuffer.prototype.writeZigZagVarint64=function(t,e){},ByteBuffer.prototype.readZigZagVarint64=function(t){},ByteBuffer.prototype.writeVarint=function(t,e){},ByteBuffer.prototype.readVarint=function(t){},ByteBuffer.prototype.writeZigZagVarint=function(t,e){},ByteBuffer.prototype.readZigZagVarint=function(t){},ByteBuffer.calculateVarint32=function(t){},ByteBuffer.calculateVarint64=function(t){},ByteBuffer.calculateUTF8String=function(t){},ByteBuffer.prototype.writeUTF8String=function(t,e){},ByteBuffer.prototype.readUTF8String=function(t,e){},ByteBuffer.prototype.readUTF8StringBytes=function(t,e){},ByteBuffer.prototype.writeLString=function(t,e){},ByteBuffer.prototype.readLString=function(t){},ByteBuffer.prototype.writeVString=function(t,e){},ByteBuffer.prototype.readVString=function(t){},ByteBuffer.prototype.writeCString=function(t,e){},ByteBuffer.prototype.readCString=function(t){},ByteBuffer.prototype.writeJSON=function(t,e,f){},ByteBuffer.prototype.readJSON=function(t,e){},ByteBuffer.prototype.toColumns=function(t){},ByteBuffer.prototype.printDebug=function(t){},ByteBuffer.prototype.toHex=function(t){},ByteBuffer.prototype.toUTF8=function(){},ByteBuffer.prototype.toBase64=function(){},ByteBuffer.prototype.toString=function(t){},ByteBuffer.prototype.toArrayBuffer=function(t){},ByteBuffer.decodeUTF8Char=function(t,e){},ByteBuffer.encodeUTF8Char=function(t,e,f){},ByteBuffer.calculateUTF8Char=function(t){},ByteBuffer.zigZagEncode32=function(t){},ByteBuffer.zigZagDecode32=function(t){},ByteBuffer.encode64=function(t){},ByteBuffer.decode64=function(t,e){},ByteBuffer.encodeHex=function(t){},ByteBuffer.decodeHex=function(t,e){},ByteBuffer.MAX_VARINT32_BYTES=5,ByteBuffer.MAX_VARINT64_BYTES=10;