!function(e){function n(t){if(o[t])return o[t].exports;var a=o[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,n),a.l=!0,a.exports}var o={};n.m=e,n.c=o,n.d=function(e,o,t){n.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(o,"a",o),o},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=120)}({120:function(e,n){var o=getApp();Page({data:{motto:"Hello World",userInfo:{},hasUserInfo:!1,canIUse:wx.canIUse("button.open-type.getUserInfo")},bindViewTap:function(){wx.navigateTo({url:"../logs/logs"})},onLoad:function(){var e=this;o.globalData.userInfo?this.setData({userInfo:o.globalData.userInfo,hasUserInfo:!0}):this.data.canIUse?o.userInfoReadyCallback=function(n){e.setData({userInfo:n.userInfo,hasUserInfo:!0})}:wx.getUserInfo({success:function(n){o.globalData.userInfo=n.userInfo,e.setData({userInfo:n.userInfo,hasUserInfo:!0})}})},getUserInfo:function(e){console.log(e),o.globalData.userInfo=e.detail.userInfo,this.setData({userInfo:e.detail.userInfo,hasUserInfo:!0})}})}});