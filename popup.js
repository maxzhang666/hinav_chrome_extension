let title_mark = ['-', '|']
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    let title = tabs[0].title;
    let fid = localStorage.getItem('last_category');
    if (fid) {
        $("#fid").val(fid);
    }
    $("#url").val(tabs[0].url);
    $("#title").val(title);
    //生成desc
    let desc = ''
    for (let i = 0; i < title_mark.length; i++) {
        if (title.indexOf(title_mark[i]) === -1) {
            continue;
        }
        let strs = title.split(title_mark[i])
        title = strs[0];
        if (strs.length > 1) {
            desc = strs[1];
        } else {
            desc = title;
        }

        title = title.trim()
        desc = desc.trim()
        //title 与 desc 中长的作为desc
        if (title.length < desc.length) {
            $("#title").val(title);
            $("#description").val(desc);
        } else {
            $("#title").val(desc);
            $("#description").val(title);
        }
    }
    if (desc == '') {
        $("#description").val(title);
    }
    $("#icon").val(tabs[0].favIconUrl);
    $("#icon_view").attr('src', tabs[0].favIconUrl);
    // console.log(tabs[0])
    // $("#description").val();
});
