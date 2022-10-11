module.exports = () => {
  return {
    name: 'cnzz-analytics',
    injectHtmlTags: () => {
      return {
        postBodyTags: [
          `<script type="text/javascript">document.write(unescape("%3Cspan style='display: none' id='cnzz_stat_icon_1279723477'%3E%3C/span%3E%3Cscript src='https://v1.cnzz.com/z_stat.php%3Fid%3D1279723477' type='text/javascript'%3E%3C/script%3E"));</script>`,
          `
           <script type="text/javascript">
             let navRight = null;
             function doFind() {
               const find = document.getElementsByClassName('navbar__items--right');
               navRight = find && find[0];
               if(navRight) {
                 navRight.prepend(htmlToElem('<div title="English documents are still in preparation, please use machine translation temporarily." id="google_translate_element" style="margin-right: 10px" ></div>'));
                 googleTranslateElementInit();
               } else {
                 setTimeout(doFind, 1000);
               }
             }
    
             function htmlToElem(html) {
               let temp = document.createElement('template');
               html = html.trim(); // Never return a space text node as a result
               temp.innerHTML = html;
               return temp.content.firstChild;
             }

             function googleTranslateElementInit() {
               new google.translate.TranslateElement({pageLanguage: 'zh-CN', includedLanguages: 'en,ja,ko,ru,fr', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
             }

           </script>
           <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=doFind"></script>
          `
        ],
      };
    },
  };
};
