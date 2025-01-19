# Changelog Template progetto DM Whisper

    19 Gen 2025
    -----------
    - 1.61.0 You can now choose an OpenAI model before sending a prompt, overriding the default model that is saved in the settings page.

    14 Gen 2025
    -----------
    - 1.60.0 You can now choose OpenAI model in the settings page.

    06 Gen 2025
    -----------
    - 1.59.0 More QoL improvements for the "saved results page": saved items are now collapsible and collapsed by default.

    05 Gen 2025
    -----------
    - 1.58.0 Quality-of-life improvements for the "saved results page": search text is now persistent, gen ai can now be used to process saved content.

    02 Gen 2025
    -----------
    - 1.57.0 Added support for ChatGPT: user can call OpenAI APIs specifying a prompt + current page content (useful to fine-tune app generated content).

    01 Gen 2025
    -----------
    - 1.56.1 Generated dungeon content is persistent until re-rolled.

    30 Dic 2024
    -----------
    - 1.56.0 Visual feedback about processing status on several pages.

    21 Dic 2024
    -----------
    - 1.55.0 Saved content import button is now also available on the saved content page.

    18 Dic 2024
    -----------
    - 1.54.0 You can now save and load saved content, of any kind.

    17 Dic 2024
    -----------
    - 1.53.0 Export saved content to PDF.

    16 Dic 2024
    -----------
    - 1.52.0 Implemented counters.
    - 1.51.0 Puzzle set items can now be laid out in order (shuffled among non ordered items)

    10 Dic 2024
    -----------
    - 1.50.0 Now you can link to dungeons and content pages from a content page / table item.

    04 Dic 2024
    -----------
    - 1.41.0 Maps are now rendered with a Canvas and a Dialog instead of ugly looking plain HTML.

    16 Ott 2024
    -----------
    - 1.40.2 Squashed small bug on AreaMap navigation.

    03 Ott 2024
    -----------
    - 1.40.1 On browsers that allow it, pressing "back" browser button now goes back one level. Chrome does not allow this fully (you have to interact with the page between "back" button presses), but Firefox does.

    29 Set 2024
    -----------
    - 1.40.0 Random dungeon generator! You can now add dungeons to your content and generate them on the fly.

    04 Set 2024
    -----------
    - 1.32.0 Added the "test" menu item.

    03 Set 2024
    -----------
    - 1.31.0 More readable names for map elements.

    16 Giu 2024
    -----------
    - 1.30.0 You can now shuffle tables values and save the shuffled list.
    - 1.29.0 You can now set min and max values to roll on for table contents (only for single tables); table values in the "browse" mode are now sorted.

    15 Giu 2024
    -----------
    - 1.28.0 You can now filter, delete and copy to clipboard saved content.

    14 Giu 2024
    -----------
    - 1.27.0 You can now edit saved table rolls / information bits (but not maps stuff).

    06 Giu 2024
    -----------
    - 1.26.3 Fixed the manual and the default data.

    05 Giu 2024
    -----------
    - 1.26.2 Fixed dice roll related bug.

    31 Mag 2024
    -----------
    - 1.26.1 Fixed corrupted setpiece saves.

    30 Mag 2024
    -----------
    - 1.26.0 Further map generator stuff.

    27 Mag 2024
    -----------
    - 1.25.0 Further map generator stuff.
    - 1.24.0 Extra robustness + map generator.

    22 Mag 2024
    -----------
    - 1.23.0 Extra robustness + error handling, now unique table results are unique even for inner tables.

    21 Mag 2024
    -----------
    - 1.22.0 It is now possible to request unique values when rolling results on a table. Please use the "unique?" checkbox when adding tables to a page.
    - 1.21.0 You can now have DMWhisper roll dice by adding one or more {{XdY}}, {{XdY+Z}}, {{XdY-Z}} string to your pages of type "table".
             DMWhisper is now more resilient to crashes.
             If you reference the same die roll multiple times in the same page with the @@xy string, ALL strings will be replaced with the die roll and not just the first one.
             
    26 Dic 2023
    -----------
    - 1.20.1 small but important fixes.

    08 Dic 2023
    -----------
    - 1.20.0 Warnings about unsaved content.

    06 Dic 2023
    -----------
    - 1.19.3 Fixed a small but nasty bug that made content reset on tab switch, only for certain content ids.
    - 1.19.2 Fixed a cosmetic bug when showing table content.

    04 Dic 2023
    -----------
    - 1.19.1 Fixed a bug that caused an endless loop.

    27 Nov 2023
    -----------
    - 1.19.0 Content is not automatically reset anymore when you switch tabs; improved random number generation.

    23 Nov 2023
    -----------
    - 1.18.0 It's now possible to enter tables into the table definition UX using an autocomplete
    - 1.17.0 It's now possible to mix tables and fixed text for the table id field; precedently it was either a single table id to roll on, or several table ids separated by spaces.

    12 Nov 2023
    -----------
    - 1.16.3 Fixed a problem with content not updating when using the bottom navigation arrows.

    03 Nov 2023
    -----------
    - 1.16.2 Descriptive rich text content can now be saved (until now it showed up as blank when saved).

    31 Ott 2023
    -----------
    - 1.16.1 You cannot save a menu item without an id anymore.

    15 Ott 2023
    -----------
    - 1.16.0 You can now filter tables in the tables editing section list.
    - 1.15.0 Now table rolls can be outputted in the descriptive rich text content through @@XY macros (see initial content for examples).

    08 Ott 2023
    -----------
    - 1.14.0 An English user manual has been added.

    07 Ott 2023
    -----------
    - 1.13.0 Bookmarks now have names.

    06 Ott 2023
    -----------
    - 1.12.0 New menu system.

    04 Ott 2023
    -----------
    - 1.11.0 Added navigation between peer contents.

    03 Ott 2023
    -----------
    - 1.10.2 Bugfixes (Menu Edit UI).

    02 Ott 2023
    -----------
    - 1.10.1 Tables choice autocomplete must allow choosing the same table multiple times (e.g. NOUN VERB NOUN).

    01 Ott 2023
    -----------
    - 1.10.0 User can now browse content with a tabbed interface.

    27 Sep 2023
    -----------
    - 1.9.1 Small corrections (link colors, table ghost item).

    25 Sep 2023
    -----------
    - 1.9.0 Store / load multiple data files and switch from one to another on the fly.

    24 Sep 2023
    -----------
    - 1.8.0 On content tree UX, tables are now chosen with an autocomplete.

    23 Sep 2023
    -----------
    - 1.7.0 Cut, copy, paste menu items.

    22 Sep 2023
    -----------
    - 1.6.0 Menus can now be rearranged. Small UI improvements.

    20 Sep 2023
    -----------
    - 1.5.2 Improved menu layout.
    - 1.5.1 Additional warning messages and hints.
    - 1.5.0 Import / Export of json data files; import a data file loding the webapp via <dmwhisper url>?datafile=<datafile url>.

    19 Sep 2023
    -----------
    - 1.4.3 Continued work on import/export of data files.
    - 1.4.2 Started work on alternative ways of importing data files (<dmwhisper url>?datafile=<datafile url>).

    18 Sep 2023
    -----------
    - 1.4.1 Fixed ckeditor theme sync, added ckeditor custom build zip for reference.

    16 Sep 2023
    -----------
    - 1.4.0 Added CKEditor for text content editing.

    15 Sep 2023
    -----------
    - 1.3.0 "Information" menu items now accept HTML.

    12 Sep 2023
    -----------
    - 1.2.0 I18N is fully in place.

    10 Sep 2023
    -----------
    - 1.1.0 Menu editing completed.

    06 Sep 2023
    -----------
    - 1.0.9 Table editing completed.

    05 Sep 2023
    -----------
    - 1.0.8 Work started on content authoring; copy content to clipboard added. Refactoring.

    25 Aug 2023
    -----------
    - 1.0.7 Small UI fixes

    23 Aug 2023
    -----------
    - 1.0.6 Added consulting mode to tables

    20 Aug 2023
    -----------
    - 1.0.5 Four seconds auto update on tables, as an option
    - 1.0.4 Error handling for user provided JSON content
  
    19 Aug 2023
    -----------
    - 1.0.3 a new set of example data, plus an update to the docs
    - 1.0.2 Small cosmetic changes and a custom icon
    - 1.0.1 Info section

    18 Aug 2023
    -----------
    - 1.0.0 Initial release