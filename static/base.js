$(document).ready(function () {
    //获取浏览器本地数据
    const api_url = localStorage.getItem('api_url');
    const api_add_link = localStorage.getItem('api_url') + '/api/add_site';
    const api_category_list = localStorage.getItem('api_url') + '/api/menus';
    const api_link_list = localStorage.getItem('api_url') + '/index.php?c=api&method=link_list&page=1&limit=9999';
    const api_token = localStorage.getItem('token');

    //如果API地址是空的，则提醒用户设置
    if ((api_url === null) || (api_url === undefined)) {
        $("#api_msg").show();
    }


    //如果已经设置了API地址，则获取category_list_data数据
    if (localStorage.getItem('api_url') != null) {
        //如果分类数据不为空，则渲染分类列表
        if (localStorage.getItem('category_list_data') !== null) {
            data = JSON.parse(localStorage.getItem('category_list_data'));
            //渲染分类列表
            for (i = 0; i < data.data.length; i++) {
                $("#fid").append('<option value = "' + data.data[i].id + '">' + data.data[i].name + '</option>');
            }
            console.log('存在数据了！');
        }
        //如果分类列表是空的，则请求API获取分类列表，然后渲染数据并存储
        else {
            $.post(api_category_list, {token: api_token}, function (data, status) {
                if (status == 'success') {
                    //渲染分类列表
                    for (i = 0; i < data.data.length; i++) {
                        $("#fid").append('<option value = "' + data.data[i].id + '">' + data.data[i].name + '</option>');
                    }
                    //将分类列表缓存起来
                    data = JSON.stringify(data);
                    localStorage.setItem('category_list_data', data);
                } else {
                    return false;
                }
            });
        }
    }

    //如果API地址不为空，则存储到浏览器
    if (api_url !== null) {
        chrome.storage.local.set({'api_url': api_url}, function () {

        });
    }

    //渲染API设置的数据
    $("#api_url").val(api_url);
    $("#token").val(api_token);

    //用户点击刷新分类数据
    $("#refresh_category").click(function () {
        //清空原有数据
        $("#fid").empty();
        //清空本地存储数据
        localStorage.removeItem('category_list_data');
        //判断API地址是否是空的
        if (api_url == null) {
            layer.msg('请先设置API！', {icon: 5});
            return false;
        } else {
            //重新请求API并缓存数据
            $.post(api_category_list, {token: api_token}, function (data, status) {
                if (status == 'success') {
                    if (data.code == 1) {

                        //渲染分类列表
                        for (i = 0; i < data.data.length; i++) {
                            $("#fid").append('<option value = "' + data.data[i].id + '">' + data.data[i].name + '</option>');
                        }
                        //将分类列表缓存起来
                        data = JSON.stringify(data);
                        localStorage.setItem('category_list_data', data);
                        layer.msg('分类已刷新！', {icon: 1});
                    } else {
                        layer.msg(data.message, {icon: 5})
                    }
                } else {
                    return false;
                }
            });
        }
    });

    //如果api_url不为空,则请求分类接口，并将分类接口数据缓存起来
    // if( ( localStorage.getItem('api_url') != null ) && ( sessionStorage.category_list == null ) ) {
    // 	alert('没有分类！');
    // 	$.post(api_category_list,{token:api_token},function(data,status){
    // 		if( status == 'success' ){
    // 			//将分类列表缓存起来
    // 			sessionStorage.category_list = data;
    // 		}
    // 		else{
    // 			return false;
    // 		}
    // 	});
    // }

    //设置URL
    //如果分类列表没有数据，则请求分类列表API，并缓存起来
    // if( localStorage.getItem('category_list_data') !== null ) {
    // 	let data = localStorage.getItem('category_list_data');
    // 	data = JSON.parse(data);
    // 	for( i = 0;i < data.data.length;i++) {
    // 		$("#fid").append('<option value = "' + data.data[i].id + '">' + data.data[i].name + '</option>');
    // 	}
    // }
    // if( (localStorage.getItem('api_url') != null) && (category_list_data == null) ) {
    // 	$.post(api_category_list,{token:api_token},function(data,status){

    // 		if(data.code == 0) {
    // 			for( i = 0;i < data.data.length;i++) {
    // 				$("#fid").append('<option value = "' + data.data[i].id + '">' + data.data[i].name + '</option>');
    // 			}
    // 		}
    // 	});
    // }
    // else{
    // 	data = category_list_data;
    // 	for( i = 0;i < data.length;i++) {
    // 		$("#fid").append('<option value = "' + data[i].id + '">' + data[i].name + '</option>');
    // 	}
    // }

    //页面加载的时候渲染所有链接,但是先判断本地是否存在数据
    //本地不存在数据，则请求API获取并渲染
    if (localStorage.getItem('link_data') === null) {
        //请求API获取数据，并将数据保存到本地
        get_link_data();

    }
    //本地存在数据，则直接使用本地存在的数据进行渲染
    else if (localStorage.getItem('link_data') !== null) {
        console.log('本地存在链接数据');
        //获取数据
        let data = localStorage.getItem('link_data');
        data = JSON.parse(data);
        if (data.code == 0) {
            for (i = 0; i < data.data.length; i++) {
                let title = data.data[i].title;
                let url = data.data[i].url;
                let icon_url = 'https://favicon.rss.ink/v1/' + window.btoa(url);
                let description = data.data[i].description;
                let link_data = '<div class="col-6 link-box">';
                link_data += '<a target = "_blank" href = "' + url + '" title = "' + title + '">'
                link_data += '<div class="alert alert-light link">';
                //链接描述，默认隐藏，主要用于搜索时匹配关键词
                link_data += '<span style = "display:none;">' + description + '</span>';
                //链接图标
                link_data += '<img style = "padding-bottom:3px;" src = "' + icon_url + '" /> ';
                link_data += '<span style = "font-weight:bold;">' + title + '</span>';
                link_data += '</div></a></div>';
                $("#link_data").append(link_data);
            }

        }
    }


    //用户点击设置API按钮
    $("#setting").click(function () {
        layer.open({
            type: 1,
            title: 'HiNav API设置',
            area: ['100%', '100%'],
            shadeClose: true, //点击遮罩关闭
            content: $('#setting_form')
        });
    });
    //用户点击保存API设置按钮
    $("#save_api").click(function () {
        //获取api_url
        let api_url = $("#api_url").val();
        //获取token
        let token = $("#token").val();

        //如果API是空的，则不允许
        pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
        if (!pattern.test(api_url)) {
            layer.msg('API地址格式有误！', {icon: 5});
            return false;
        }

        //如果token不合法
        if ((token !== '') && (token.length !== 32)) {
            // layer.msg('Token不合法！', {icon: 5});
            // return false;
        }

        //保存数据
        localStorage.setItem('api_url', api_url);
        localStorage.setItem('token', token);
        //清空链接列表
        $("#link_data").empty();
        //删除本地数据
        localStorage.removeItem('link_data');

        //通过API获取数据
        get_link_data();
        setTimeout(function () {
            h.start();
        }, 2000);

        //刷新分类数据
        refresh_category();

        layer.msg('设置已保存', {icon: 1});
        setTimeout(function () {
            layer.closeAll();
        }, 2000);
    });
    //用户点添加链接
    $("#add_link").click(function () {
        //获取字段数据
        let url = $("#url").val();
        let title = $("#title").val();
        let fid = $("#fid").val();
        let description = $("#description").val();
        let icon = $("#icon").val();
        // let property = $("input[type='radio']:checked").val();

        $.post(api_add_link, {
            token: api_token,
            url: url,
            name: title,
            cat: fid,
            desc: description,
            icon: icon
        }, function (data, status) {
            if (data.code != 0) {
                layer.msg('链接已添加！', {icon: 1});
                //链接添加完毕后刷新链接数据
                //清空链接列表
                $("#link_data").empty();
                //删除本地数据
                localStorage.removeItem('link_data');
                localStorage.setItem('last_category', fid);
                //通过API重新获取数据
                get_link_data();
                setTimeout(function () {
                    h.start();
                }, 2000);
                setTimeout(function () {
                    layer.closeAll();
                }, 2000);
            } else {
                layer.msg(data.message, {icon: 5});
            }
        });
    });
    //用户点击打开主页
    $("#open_home").click(function () {
        let home_url = localStorage.getItem('api_url');
        if ((home_url != '') || (home_url != null)) {
            chrome.tabs.create({url: home_url});
        } else {
            layer.msg('请先设置API！', {icon: 5});
        }
    });
    //用户点击添加链接
    $("#on_add_link").click(function (data, status) {
        layer.open({
            type: 1,
            title: '添加链接',
            area: ['100%', '100%'],
            shadeClose: true, //点击遮罩关闭
            content: $('#add_link_form')
        });
    });
    //用户点击刷新链接数据
    $("#refresh_link_data").click(function (data, status) {
        //清空链接列表
        $("#link_data").empty();
        //删除本地数据
        localStorage.removeItem('link_data');
        //通过API重新获取数据
        get_link_data();
        setTimeout(function () {
            h.start();
        }, 2000);
        layer.msg('数据刷新完毕！', {icon: 1});
    });
    //用户点击返回顶部按钮
    $("#gotop").click(function () {
        $("html,body").animate({scrollTop: '0px'}, 600);
    });
    $('input[name="h5logincode"]').on('change', function () {
        var _this = $(this);
        if (_this.val().length > 0) {
            $('#icon_view').attr('src', _this.val());
        }
    });
    $("#icon").on('change', () => {
        $('#icon_view').attr('src', $('#icon').val());
    })
});

//请求API获取URL列表
function get_link_data() {
    //获取浏览器本地数据
    const api_link_list = localStorage.getItem('api_url') + '/index.php?c=api&method=link_list&page=1&limit=9999';
    const api_token = localStorage.getItem('token');

    $.post(api_link_list, {token: api_token}, function (data, status) {
        //sessionStorage.category_list = data;
        if (data.code == 0) {
            for (i = 0; i < data.data.length; i++) {
                let title = data.data[i].title;
                let url = data.data[i].url;
                let icon_url = 'https://favicon.rss.ink/v1/' + window.btoa(url);
                let description = data.data[i].description;
                let link_data = '<div class="col-6 link-box">';
                link_data += '<a target = "_blank" href = "' + url + '" title = "' + title + '">'
                link_data += '<div class="alert alert-light link">';
                //链接描述，默认隐藏，主要用于搜索时匹配关键词
                link_data += '<span style = "display:none;">' + description + '</span>';
                //链接图标
                link_data += '<img style = "padding-bottom:3px;" src = "' + icon_url + '" /> ';
                link_data += '<span style = "font-weight:bold;">' + title + '</span>';
                link_data += '</div></a></div>';
                $("#link_data").append(link_data);
            }
            //链接数据保存到本地
            data = JSON.stringify(data);
            localStorage.setItem('link_data', data);
        }
    });
}

//刷新分类数据
function refresh_category() {
    //清空原有数据
    $("#fid").empty();
    //清空本地存储数据
    localStorage.removeItem('category_list_data');

    //获取API地址和token
    api_category_list = localStorage.getItem('api_url') + '/api/menus';
    api_token = localStorage.getItem('token');

    //重新请求API并缓存数据
    $.post(api_category_list, {token: api_token}, function (data, status) {
        if (status == 'success') {
            //渲染分类列表
            for (i = 0; i < data.data.length; i++) {
                $("#fid").append('<option value = "' + data.data[i].id + '">' + data.data[i].name + '</option>');
            }
            //将分类列表缓存起来
            data = JSON.stringify(data);
            localStorage.setItem('category_list_data', data);
            //layer.msg('分类已刷新！', {icon: 1});
        } else {
            return false;
        }
    });
}

//搜索书签
const h = holmes({
    input: '.search',
    find: '.link-box',
    placeholder: '<h4><center>未找到匹配结果！</center></h4>'
});

//由于是异步获取数据，等书签加载完毕后延迟2s执行
setTimeout(function () {
    h.start();
}, 2000);
