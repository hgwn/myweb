"use strict";describe("debounce",function(){var e,t,c,o,n;beforeEach(module("mgcrea.ngStrap.helpers.debounce")),beforeEach(inject(function(u,r,i,f,d){c=u,e=r,t=i,o=f,n=d})),describe("debounce",function(){it("should correctly debounce a function",function(){var e=0,c=function(){e++},n=o(c,12);n(),n(),expect(e).toBe(0),t.flush(),expect(e).toBe(1)})}),describe("throttle",function(){it("should correctly throttle a function",function(){var e=0,c=function(){e++},o=n(c,12);o(),o(),expect(e).toBe(1),t.flush(),expect(e).toBe(2)})})});