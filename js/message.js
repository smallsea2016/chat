/*========== iscroll无限加载 START ==========*/
  var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

/**
 * 下拉翻页 （自定义实现此方法）
 * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
 */
function pullDownAction () {
    console.log('up');
    setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
        var el, li, i;
        // el = document.getElementById('ui_list');
        var str;
        for (i=0; i<5; i++) {
            str = '<li class="pr">' +
                '<div class="dialog_name_right">' +
                  '<div class="dialog_name_round">' +
                    '<div class=""><img class="user_photo" src="images/user.jpg" alt=""></div>' +
                  '</div>' +
                '</div>' +
                '<div class="dialog_content_right">' +
                  '<span class="dialog_name">我</span>'+
                  '<span class="c_red">新数据'+(++generatedCount)+'</span>' +
                '</div>' +
                '<div class="clearfix"></div>' +
              '</li>';
            // $('.dialog_list .ui_list').prepend(str);
        }
        myScroll.refresh();     // 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
    }, 1000); 
}

/**
 * 上拉刷新 （自定义实现此方法）
 * myScroll.refresh();      // 数据加载完成后，调用界面更新方法
 */
function pullUpAction () {
     myScroll.refresh();
}

/**
 * 初始化iScroll控件
 */
function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');   
    pullUpOffset = pullUpEl.offsetHeight;
    console.log(pullUpOffset);
    myScroll = new iScroll('wrap_inner_content', {
        scrollbarClass: 'myScrollbar', 
        useTransition: false, 
        checkDOMChanges: true, //dom改变的时候refresh
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';                
                pullDownAction();   // Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';                
                pullUpAction(); // Execute custom function (ajax call?)
            }
        }
    });
}
setTimeout(function(){
   myScroll.scrollToElement('#ul1>li:last-child',200);
},500);

//初始化绑定iScroll控件 
function preventEvent(e){
    // console.log(e);
    e.preventDefault();
}
document.addEventListener('touchmove', preventEvent, false);
// document.addEventListener('touchmove', function(e){console.log(e);e.preventDefault();}, false);
document.addEventListener('DOMContentLoaded', loaded, false); 

/*========== iscroll无限加载 END ==========*/

//截取"#"字符以后的字符串
if(window.location.href.indexOf("#") > 0){
    var href = window.location.href;
    href = href.substring(0,href.lastIndexOf("#"));
    window.location.href = href;
}

//输入框高度自适应
var $textarea = $('#dialog_input');
$('body').append($textarea.clone().attr('id','clone_textarea'));
$('#clone_textarea').css({
 'position':'absolute',
 'left':'-120000px'
});
$textarea.on('input',function(){
   var $this = $(this);
   if(this.value.length){
      $('.send_msg').removeAttr('disabled');
   }else{
      $('.send_msg').attr('disabled','disabled');
   }
   $('#clone_textarea').val($textarea.val());
   $('#clone_textarea').css({
	   'width':$textarea[0].scrollWidth,
   });
   var h=$('#clone_textarea')[0].scrollHeight;
  	   h=h>70?70:(h>30?h+2:30);
  	   $this.height(h);
})

//默认的textarea
function defaultTextarea(){
   $("#dialog_input").css("height","32px");
   $("#dialog_input").val('');
   $('.send_msg').attr('disabled','disabled');
}

//点击发送
function sendMsg(){
    console.log('点击发送');
    if ($.trim($textarea.val()) == '') {
      return
    };
    //编译表情
    var str = '';
        str = '<li class="pr">' +
                '<div class="dialog_name_right">' +
                  '<div class="dialog_name_round">' +
                    '<div class=""><img class="user_photo" src="images/user.jpg" alt=""></div>' +
                  '</div>' +
                '</div>' +
                '<div class="dialog_content_right">' +
                  '<span class="dialog_name">我</span>'+
                  '<span class="c_red">'+$textarea.val()+'</span>' +
                '</div>' +
                '<div class="clearfix"></div>' +
              '</li>';
    
    //字符串转图片
    // var faceElm = document.querySelectorAll('#face a');
    // for (var i = 0; i < faceElm.length; i++) {
    //     var faceElmR = faceElm[i].getAttribute('title');
    //     var dataSrc =  faceElm[i].getAttribute('data-img-src');
    //     str = str.replace('['+faceElmR+']','<img width="22" height="22" src="'+dataSrc+'">');
    // };
    $('.dialog_list .ui_list').append(str);
    defaultTextarea();
    //发送的时候滚动到底
    setTimeout(function(){
      myScroll.refresh();
      myScroll.scrollToElement('#ul1>li:last-child',200);
    },500)    
 };

/*显示隐藏图片和电话图标*/
function toggle(){
  $('#action_icon_group').toggle()
}