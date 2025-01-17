



function menuEmbedLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let embed = contents.getElementsByClassName("menu_embed")[0];
    let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);
    let chapterTitle = contents.getElementsByClassName("chapter_title")[0].innerHTML.trim();

    //비디오 플레이어 생성
    let property = {
        'autoPlay': true,
        'thumbnailImage': partInfo["thumbnail_image"],
        'partNumber': partInfo["number"],
        'videoTitle': partInfo["title"],
        'workTitle': workInfo["title"],
        'chapterTitle': chapterTitle,
        'originatorName': workInfo["originator"]["nickname"],
        'language': partInfo["language"],
        'originalLanguage': partInfo["original_language"],
        'localizationLanguage': partInfo["localization_language"],
        'percentViewed': partInfo["percent_viewed"],
        'embed': true
    }
    createVideoPlayer(embed, partInfo["data"], property);

    //스크롤 금지
    setBodyScroll(false);
}