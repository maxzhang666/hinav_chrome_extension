
// 扩展运行时 - 下载时触发
chrome.runtime.onInstalled.addListener(() => {
	// 创建一个右键菜单
	chrome.contextMenus.create(
    {
      // item的类型
      type: 'normal',
      // 显示的文字，%s占位符会显示你选中的字
      title: '添加到HiNav书签',
      // 这个菜单的id
      id: 'hinav',
      // 可以出现这个菜单项的上下文
      contexts: ['all']
    },
    // 创建后的 回调
    function () {
		console.log('contextMenus are create.');
	}
	)

})
// 右键菜单点击的时候触发
//var api_url = localStorage.getItem('api_url');
chrome.contextMenus.onClicked.addListener(function(info,tabs){
	chrome.storage.local.get(['api_url'], function(result) {
		//拼接快速添加链接的URL
		api_quick_url = result.api_url + "/index.php?c=admin&page=add_quick_tpl&url=" + encodeURIComponent(tabs.url) + "&title=" + encodeURIComponent(tabs.title);
		//新建一个窗口,//参考https://developer.chrome.com/docs/extensions/reference/windows/#type-CreateType
		chrome.windows.create(
			{
				"height": 460,
				"type": "popup",
				"url": api_quick_url,
				"width" : 400,

				"top": 160
			}
		);

	});
})
