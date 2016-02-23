/*
	//6.2.1
	//工厂模式:解决用Object构造函数或对象字面量创建单个对象，使用同一接口创建很对对象时，产生大量重复代码的问题。
	//不足：没有解决对象的识别问题（即怎样知道一个对象的类型）
	function creatPerson(name,age,job){
		var o = new Object();
		o.name = name;
		o.age = age;
		o.job = job;
		o.sayname = function(){
			alert(this.name);
		};
		return o;
	}
	var person1 = creatPerson("lee",28,"software engineer");
	var person2 = creatPerson("dd",28,"doctor");
	console.log(person1.name);
	person1.sayname();
	person2.sayname();*/

	//6.2.2
	//构造函数模式:可创建特定类型的对象(即解决了工厂模式无法解决对象的识别问题)
	//创建自定义的构造函数意味着将来可以将它的实例标识为一种特定的类型,这是构造函数模式胜过工厂模式的之处.
	//不足：构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。

	/*function Person(name,age,job){  //构造函数函数名，按惯例，首字母要大写
		this.name = name;
		this.age = age;
		this.job = job;
		this.sayname = function(){alert(this.name);};
		//下面一行代码，每个Person实例都包含一个不同的Function实例
		//this.sayname= new Function("alert(this.name)"); //与声明函数在逻辑上是等价的
	}
	var person1 = new Person("llll",29,"ddd");
	var person2 = new Person("222",29,"ddd22");
	//对象的constructor（构造函数）属性最初是用来标识对象类型的。
	//检测对象类型，用instanceof操作符更可靠
	console.log(person1.constructor == Person);
	console.log(person1 instanceof Object);
	console.log(person1 instanceof Person);

	//当作构造函数使用
	var person = new Person("构造",29,"ddd");
	person.sayname();

	//当作普通函数使用
	Person("通函数",222,"dd2"); 
	window.sayname();
	console.log(window.job);
	var temp = {};
	Person.call(temp,"apply",22,"000");
    temp.sayname();

	//在另一个对象的作用域中调用
	var o = new Object();
	Person.call(o,"kkk",18,"xx");
	o.sayname();*/

	/*
	//6.2.3
	//原型模式:创建的每一个函数都有一个prototype(原型)属性，这个属性是一个指针，指向一个对象，
	//而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。

	function Person(){

	}
	Person.prototype.name = "原型prototype";
	Person.prototype.age = 28;
	Person.prototype.job = "software engineer";
	Person.prototype.sayname=function(){
		alert(this.name);
	};
	var person1 = new Person();
	//person1.sayname();  //原型prototype
	var person2 = new Person();
	//person2.sayname();
	//console.log(person1.sayname() == person2.sayname());
	person1.name="修改name1";
	alert(person1.name); // 修改name1
	alert(person2.name); // 原型prototype
	//alert(person1.hasOwnProperty("name")); 
	//hasOwnProperty()只在属性存在于实例才为true，若为原型的属性则为false
	//alert(person2.hasOwnProperty("name"));

	alert("name" in person1 ); //trur  in操作符只要通过对象能够访问属性就返回true
	alert("name" in person2 ); //true  既包括存在于实例中的属性，也包括存在于实例的属性

	//判断属性到底是存在于对象中，还是存在于原型
	//返回true则存在于原型
	function hasProtoyepeProperty(object,name){
		return !object.hasOwnProperty(name) && (name in object)
	}
	//alert(hasProtoyepeProperty(person1,"name")); //false
	//alert(hasProtoyepeProperty(person2,"name")); //true*/

	//测试
	//简单的原型语法
	/*function Person(){
	}
	Person.prototype={
		name:"lll",
		age:"28",
		job:"software engineer",
		sayname:function(){
			alert(this.name);
		},
		friend:["aaa","bbb","ccc"]  //引用类型数组
	};

	var person1 = new Person();
	var person2 = new Person();
	//person1.sayname();  //lll
	//person2.sayname();  //lll
	person1.name="222";
	//alert(person1.name); //222  实例属性
	//alert(person2.name); //lll  原型属性
	//alert(person1.hasOwnProperty("name")); //true  hasOwnProperty()属性存在于实例为ture
	//alert(person2.hasOwnProperty("name")); //false hasOwnProperty()属性存在于原型为false
	//person1.sayname();

	var friend = new Person();
	Person.prototype.sayhi = function(){
		alert("hi");
	};
	//alert(friend.name);
	//friend.sayhi();  //当调用friend.sayhi()时，首先搜索实例sayhi的属性，没有找到，继续搜索原型.

	//alert(typeof friend.prototype); //undefined
	//console.log(friend.prototype); //undefined
	//alert(typeof friend.constructor); //function
	//console.log(friend.constructor); //


//在定义函数的时候，函数定义的时候函数本身就会默认有一个prototype的属性，
//而如果用new 运算符来生成一个对象的时候就没有prototype属性
	//alert(typeof Person.prototype); //object

	//原型对象的问题：
	//首先，它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将取得相同的属性值。
	//原型模式最大的问题是由其共享的本质导致的。
	//原型中所有属性是被很多实例共享的，
	//对于基本类型的属性还好，毕竟通过在实例添加一个同名属性，可以隐藏原型中的对象属性。
	//然而，对于引用类型值的属性，就有问题了。
	//如下面，修改person1.friend引用的数组，向数组添加一个字符串。
	//由于friend数组存在于Person.prototype而非Person1中，
	//所以person1.friend修改也会通过person2.friend(与person1.friend指向同一个数组)反应出来。

	person1.friend.push("xxx"); //修改引用类型值的属性 影响原型中的属性;而基本类型没事.
	alert(person1.friend); //aaa,bbb,ccc,xxx
	alert(person2.friend); //aaa,bbb,ccc,xxx    
	alert(person1.friend == person2.friend)  //true;
	alert(person1.name); //222
	alert(person2.name); //lll
	alert(person1.name == person2.name); //false*/


	//原型记录

	/*
		//每创建一个函数，就会同时创建它的prototype对象，这个对象也会自动获得constructor属性.
	function Test(){}
	//Test.prototype.name = "1111";

	//下面本质上是重写整个原型对象，constructor属性不再指向Test了。
	Test.prototype={
		//constructor:Test,
		name:"1111"
	}
	var ddd  = new Test();
	alert(ddd.constructor == Test); //true

	
	function TestPerson(name,age,job){
	}
	TestPerson.prototype={
		//constructor:TestPerson, //将constructor（译 构造函数)属性的值设为TestPerson
		name:"TestPerson",
		age:16,
		job:"doctor",
		sayName:function(){
			alert(this.name);
		}
	};

	var testperson1 = new TestPerson();
	//alert(testperson1 instanceof Object); //true
	//alert(testperson1 instanceof TestPerson); //true
	//alert(testperson1.constructor == TestPerson); //false
	//alert(testperson1.constructor == Object); //true
	//使用构造函数模式和原型模式
	//构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性
	function Person(name,age,job){
		this.name = name;
		this.age = age;
		this.job = job;
		this.friends = ["dog","fish"];
	}
	Person.prototype={
		constructor:Person,
		sayName:function(){
			alert(this.name);
		}
	}
	var person1 = new Person("aaa",18,"software");
	var person2 = new Person("bbb",28,"engineer");
	person1.friends.push("zzz");
	//alert(person1.friends);
	//alert(person2.friends);

	*/

	/*
	//调用构造函数时会为实例添加一个指向最初原型的【prototype】指针，而把原型修改为另一个对象就等于切断了构造函数与最初原型直接的联系。
	function TestPrototype(){
	}
	var testprototype = new TestPrototype();
	//下面重写整个原型对象
	TestPrototype.prototype={
		constructor:TestPrototype,//将Prototype原型对象的constructor属性的值设为
		name:"测试",
		age:29,
		job:"web",
		sayName:function(){
			alert(this.name);
		}
	}
	//testprototype.sayName(); //报错   实例中的指针仅指向原型，而不指向构造函数

	//5.原生对象的原型
	//所有原生引用类型（Object/Array/String？？等等）都在其构造函数的原型上定义了方法。
    //例如，在Array.prototype中找到sort()方法，而在String.prototype中可以找到substring()方法
    
    //alert(typeof Array.prototype.sort);  //function
    //alert(typeof String.prototype.substring); //function
	
	//下面代码给基本包装类型String添加一个名为startsWith()的方法
	String.prototype.startsWith=function(text){
		return this.indexOf(text) == 0;
	};
	var msg = "Hello world!";
	alert(msg.startsWith("H")); //true

	//6.2.5动态原型模式  ：把所有信息都封装在构造函数中，通过检查某个应该存在的方法是否有效，来决定是否初始化原型。

	//实例：
	function Person(name,age,job){
		//属性
		this.name = name;
		this.age = age;
		this.job =job;
		//方法
		if(typeof this.sayName !='function'){
			Person.prototype.sayName = function(){
				alert(this.name);
			};
		}
	}
	
	var person1 = new Person("动态原型模式",28,"software engineer");
	person1.sayName();

	*/

	//6.3继承
	//6.3.1原型链
	//构造函数、原型和实例的关系:
	//每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，
	//而实例都包含一个指向原型对象的内部指针。

