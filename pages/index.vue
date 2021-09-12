<template>
  <div class="relative flex items-top min-h-screen bg-gray-100 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <div class="bg-white flex items-center w-full h-20 border-b border-gray-200 relative">
        <div class="w-72 p-3 px-5 h-20 flex items-center">
          <NuxtLink class="flex items-center" to="/">
            <i class="fa-thin fa-computer-speaker fa-2xl mr-2" />
            <div class="flex flex-col">
              <div class="uppercase text-purple-400 leading-none">
                Audio<span class="font-semibold text-gray-500">Serve</span>
              </div>
              <div class="leading-none text-xs text-gray-400">
                {{ group }}
              </div>
            </div>
          </NuxtLink>
        </div>
        <div :class="{ mobilesearch: search, flex: search }" class="px-0 w-full items-center">
          <floating-label-input :class="{ block: search, hidden: !search }" v-model="searchterm" title="Search..." />
          <div class="ml-3">
          <div @click="search = false" :class="{ flex: search, hidden: !search }" class="rounded-full bg-gray-300 w-8 h-8 justify-center items-center"><i class="fa-thin fa-times fa-fw" /></div>
          </div>
          <div :class="{ hidden: search }" class="flex lg:hidden justify-end text-lg mr-1">
            <div @click="search = true" class="bg-gray-100 rounded w-10 h-10 flex justify-center items-center mx-1">
              <i class="fa-thin fa-magnifying-glass" />
            </div>
            <div @click="menu = !menu" class="bg-gray-100 rounded w-10 h-10 flex justify-center items-center mx-1">
              <i class="fa-thin fa-bars" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full relative">
        <div :class="{ '-translate-x-full': !menu, 'translate-x-0': menu }" class="transition-all w-screen transform lg:translate-x-0 lg:w-72 p-8 px-3 min-h-screen bg-white border-r border-gray-200 absolute inset-0 lg:relative">
          <NuxtLink class="flex items-center my-2 p-2" to="/">
            <i class="fa-thin fa-layer-group mr-2 fa-lg fa-rotate-by" style="--fa-rotate-angle: 115deg;" />
            Library
          </NuxtLink>
          <NuxtLink class="flex items-center my-2 p-2" to="/">
            <i class="fa-thin fa-gear mr-2 fa-lg" />
            Settings
          </NuxtLink>
          <NuxtLink class="flex items-center my-2 p-2" to="/">
            <i class="fa-thin fa-gear mr-2 fa-lg" />
            Cached
          </NuxtLink>
          <div class="flex items-center my-2 p-2" @click="logout">
            <i class="fa-thin fa-gear mr-2 fa-lg" />
            Logout
          </div>
        </div>
        <div class="p-3 px-5 w-screen lg:w-full content-area overflow-auto">
          <template v-if="folder && folder.subfolders">
            <div
              v-if="folder.subfolders.length > 0"
              class="mt-8 text-xl font-bold text-gray-600"
            >
              Folders
              <div v-if="breadcrumbs.length > 1" class="breadcrumbs flex-col lg:flex-row">
                <span
                  v-for="(breadcrumb, index) in breadcrumbs"
                  :key="index"
                  :class="{active: breadcrumb.active }"
                  @click="selectFolder({ path: breadcrumb.link })"
                >
                  {{ breadcrumb.name }}
                </span>
              </div>
            </div>
            <div
              v-for="(subfolder, index) in folder.subfolders"
              :key="index"
              class="bg-white p-5 rounded-lg my-2 w-full text-gray-600 max-w-xl cursor-pointer"
              @click="selectFolder(subfolder)"
            >
              <i class="fa-thin fa-folder mr-2 fa-lg" />
              {{ subfolder.name }}
            </div>
          </template>
          <template v-if="folder && folder.files">
            <div
              v-if="folder.files.length > 0"
              class="mt-8 text-xl font-bold text-gray-600"
            >
              Files
              <div v-if="breadcrumbs.length > 1" class="breadcrumbs flex-col lg:flex-row">
                <span
                  v-for="(breadcrumb, index) in breadcrumbs"
                  :key="index"
                  :class="{active: breadcrumb.active }"
                  @click="selectFolder({ path: breadcrumb.link })"
                >
                  {{ breadcrumb.name }}
                </span>
              </div>
            </div>
            <div
              v-for="(file, index) in folder.files"
              :key="index"
              class="bg-white p-5 rounded-lg my-2 w-full max-w-xl cursor-pointer"
              @click="selectFile(file)"
            >
              <i class="fa-thin fa-file-audio mr-2 fa-lg" />
              {{ file.name }}
            </div>

          </template>
        </div>
      </div>
      <div v-if="loginStatus===false" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
        <div class="bg-white  rounded-lg flex flex-col p-8 w-full max-w-md m-4">
          <div class="flex justify-center mb-5">
            <NuxtLink class="flex items-center" to="/">
              <i class="fa-thin text-5xl fa-computer-speaker mr-2" />
              <div class="flex flex-col">
                <div class="uppercase text-purple-400 text-2xl leading-none">
                  Audio<span class="font-semibold text-gray-500">Serve</span>
                </div>
              </div>
            </NuxtLink>
          </div>
          <floating-label-input class="my-2" :value="server" @input="updateServer" title="Server" />
          <floating-label-input class="my-2" v-model="secret" title="Shared Secret" />
          <floating-label-input class="my-2" v-model="group" title="Group" />
          <button class="bg-purple-400 text-white w-full mt-3 p-3 rounded-xl text-lg" @click="login">
            Login
          </button>
        </div>
      </div>
    </div>
    <div :class="{'-mr-96': rightbar === false, 'translate-x-full': rightbar === false}" class="transform transition-all border-l h-screen border-gray-200 w-full max-w-sm items-top absolute lg:relative inset-0 flex bg-white flex-col">
      <folder-details v-if="folder !== null && folder.files && folder.files.length === 0" :server="server" :details="folder" :name="foldername" :fake="isfake" />
      <book-details
        v-if="folder !== null && folder.files && folder.files.length > 0"
        :server="server"
        :details="folder"
        :name="foldername"
        :fake="isfake" />
    </div>
    <div :class="{'translate-y-full': player === false}" class="transition-all transform absolute right-0 border-l h-screen border-gray-200 w-full max-w-sm items-top flex bg-white flex-col">
      <player v-if="folder !== null && player !== false" :server="server" :details="folder" />
    </div>
  </div>
</template>

<script>
import FolderDetails from '../components/FolderDetails'
import FloatingLabelInput from '~/components/FloatingLabelInput.vue'
import Player from '~/components/Player.vue'

function fakeIt () {
  return {
    base: JSON.parse('{"files":[],"subfolders":[{"name":"Austene Jane","path":"Austene Jane","is_file":false},{"name":"Chesterton Gilbert Keith","path":"Chesterton Gilbert Keith","is_file":false},{"name":"Doyle Arthur Conan","path":"Doyle Arthur Conan","is_file":false},{"name":"Dumas Alexandre","path":"Dumas Alexandre","is_file":false},{"name":"Leblanc Maurice","path":"Leblanc Maurice","is_file":false},{"name":"Melville Herman","path":"Melville Herman","is_file":false},{"name":"Stevenson Robert Louis","path":"Stevenson Robert Louis","is_file":false},{"name":"Stoker Bram","path":"Stoker Bram","is_file":false},{"name":"Verne Jules","path":"Verne Jules","is_file":false},{"name":"Wells H G","path":"Wells H G","is_file":false}],"cover":null,"description":{"path":"welcome.md","mime":"text/markdown"}}'),
    'Austene%20Jane': JSON.parse('{"files":[],"subfolders":[{"name":"Pride And Prejudice","path":"Austene Jane/Pride And Prejudice","is_file":false}],"cover":{"path":"Austene Jane/800px-CassandraAusten-JaneAusten(c.1810)_hires.jpg","mime":"image/jpeg"},"description":{"path":"Austene Jane/info.txt","mime":"text/plain"}}'),
    'Chesterton%20Gilbert%20Keith': JSON.parse('{"files":[],"subfolders":[{"name":"The Flying Inn","path":"Chesterton Gilbert Keith/The Flying Inn","is_file":false}],"cover":{"path":"Chesterton Gilbert Keith/440px-Gilbert_Chesterton.jpg","mime":"image/jpeg"},"description":{"path":"Chesterton Gilbert Keith/author.md","mime":"text/markdown"}}'),
    'Doyle%20Arthur%20Conan': JSON.parse('{"files":[],"subfolders":[{"name":"The Adventures of Sherlock Holmes","path":"Doyle Arthur Conan/The Adventures of Sherlock Holmes","is_file":false}],"cover":{"path":"Doyle Arthur Conan/220px-Arthur_Conan_Doyle_by_Walter_Benington,_1914.png","mime":"image/png"},"description":{"path":"Doyle Arthur Conan/doyle.md","mime":"text/markdown"}}'),
    'Dumas%20Alexandre': JSON.parse('{"files":[],"subfolders":[{"name":"Count Monte Cristo","path":"Dumas Alexandre/Count Monte Cristo","is_file":false}],"cover":{"path":"Dumas Alexandre/440px-Alexander_Dumas_père_par_Nadar_-_Google_Art_Project.jpg","mime":"image/jpeg"},"description":{"path":"Dumas Alexandre/author.md","mime":"text/markdown"}}'),
    'Leblanc%20Maurice': JSON.parse('{"files":[],"subfolders":[{"name":"Arsene Lupin - Gentleman Burgler","path":"Leblanc Maurice/Arsene Lupin - Gentleman Burgler","is_file":false}],"cover":{"path":"Leblanc Maurice/Maurice-leblanc.jpg","mime":"image/jpeg"},"description":{"path":"Leblanc Maurice/info.txt","mime":"text/plain"}}'),
    'Melville%20Herman': JSON.parse('{"files":[],"subfolders":[{"name":"Moby Dick","path":"Melville Herman/Moby Dick","is_file":false}],"cover":{"path":"Melville Herman/220px-Herman_Melville_by_Joseph_O_Eaton.jpg","mime":"image/jpeg"},"description":{"path":"Melville Herman/info.txt","mime":"text/plain"}}'),
    'Stevenson%20Robert%20Louis': JSON.parse('{"files":[],"subfolders":[{"name":"Treasure Island","path":"Stevenson Robert Louis/Treasure Island","is_file":false}],"cover":{"path":"Stevenson Robert Louis/220px-Robert_Louis_Stevenson_by_Henry_Walter_Barnett_bw.jpg","mime":"image/jpeg"},"description":null}'),
    'Stoker%20Bram': JSON.parse('{"files":[],"subfolders":[{"name":"Dracula","path":"Stoker Bram/Dracula","is_file":false}],"cover":{"path":"Stoker Bram/800px-Bram_Stoker_1906.jpg","mime":"image/jpeg"},"description":{"path":"Stoker Bram/info.txt","mime":"text/plain"}}'),
    'Verne%20Jules': JSON.parse('{"files":[],"subfolders":[{"name":"Around The World in Eighty Days","path":"Verne Jules/Around The World in Eighty Days","is_file":false}],"cover":{"path":"Verne Jules/225px-Félix_Nadar_1820-1910_portraits_Jules_Verne_(restoration).jpg","mime":"image/jpeg"},"description":{"path":"Verne Jules/author.md","mime":"text/markdown"}}'),
    'Wells%20H%20G': JSON.parse('{"files":[],"subfolders":[{"name":"Invisible Man","path":"Wells H G/Invisible Man","is_file":false}],"cover":{"path":"Wells H G/H.G._Wells_by_Beresford.jpg","mime":"image/jpeg"},"description":{"path":"Wells H G/info.txt","mime":"text/plain"}}'),
    'Pride%20And%20Prejudice': JSON.parse('{"files":[{"name":"prideandprejudice_01_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_01_austen_64kb.mp3","meta":{"duration":328,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_02_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_02_austen_64kb.mp3","meta":{"duration":296,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_03_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_03_austen_64kb.mp3","meta":{"duration":586,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_04_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_04_austen_64kb.mp3","meta":{"duration":370,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_05_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_05_austen_64kb.mp3","meta":{"duration":344,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_06_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_06_austen_64kb.mp3","meta":{"duration":801,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_07_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_07_austen_64kb.mp3","meta":{"duration":638,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_08_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_08_austen_64kb.mp3","meta":{"duration":719,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_09_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_09_austen_64kb.mp3","meta":{"duration":586,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_10_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_10_austen_64kb.mp3","meta":{"duration":748,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_11_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_11_austen_64kb.mp3","meta":{"duration":544,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_12_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_12_austen_64kb.mp3","meta":{"duration":226,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_13_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_13_austen_64kb.mp3","meta":{"duration":571,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_14_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_14_austen_64kb.mp3","meta":{"duration":403,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_15_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_15_austen_64kb.mp3","meta":{"duration":568,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_16_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_16_austen_64kb.mp3","meta":{"duration":1122,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_17_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_17_austen_64kb.mp3","meta":{"duration":458,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_18_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_18_austen_64kb.mp3","meta":{"duration":1682,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_19_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_19_austen_64kb.mp3","meta":{"duration":693,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_20_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_20_austen_64kb.mp3","meta":{"duration":550,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_21_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_21_austen_64kb.mp3","meta":{"duration":665,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_22_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_22_austen_64kb.mp3","meta":{"duration":567,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_23_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_23_austen_64kb.mp3","meta":{"duration":513,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_24_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_24_austen_64kb.mp3","meta":{"duration":659,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_25_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_25_austen_64kb.mp3","meta":{"duration":499,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_26_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_26_austen_64kb.mp3","meta":{"duration":735,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_27_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_27_austen_64kb.mp3","meta":{"duration":428,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_28_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_28_austen_64kb.mp3","meta":{"duration":473,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_29_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_29_austen_64kb.mp3","meta":{"duration":835,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_30_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_30_austen_64kb.mp3","meta":{"duration":378,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_31_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_31_austen_64kb.mp3","meta":{"duration":517,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_32_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_32_austen_64kb.mp3","meta":{"duration":476,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_33_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_33_austen_64kb.mp3","meta":{"duration":578,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_34_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_34_austen_64kb.mp3","meta":{"duration":679,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_35_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_35_austen_64kb.mp3","meta":{"duration":995,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_36_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_36_austen_64kb.mp3","meta":{"duration":662,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_37_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_37_austen_64kb.mp3","meta":{"duration":499,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_38_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_38_austen_64kb.mp3","meta":{"duration":364,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_39_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_39_austen_64kb.mp3","meta":{"duration":489,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_40_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_40_austen_64kb.mp3","meta":{"duration":540,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_41_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_41_austen_64kb.mp3","meta":{"duration":782,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_42_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_42_austen_64kb.mp3","meta":{"duration":602,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_43_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_43_austen_64kb.mp3","meta":{"duration":1503,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_44_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_44_austen_64kb.mp3","meta":{"duration":778,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_45_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_45_austen_64kb.mp3","meta":{"duration":587,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_46_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_46_austen_64kb.mp3","meta":{"duration":969,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_47_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_47_austen_64kb.mp3","meta":{"duration":1242,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_48_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_48_austen_64kb.mp3","meta":{"duration":713,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_49_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_49_austen_64kb.mp3","meta":{"duration":692,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_50_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_50_austen_64kb.mp3","meta":{"duration":756,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_51_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_51_austen_64kb.mp3","meta":{"duration":628,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_52_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_52_austen_64kb.mp3","meta":{"duration":950,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_53_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_53_austen_64kb.mp3","meta":{"duration":922,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_54_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_54_austen_64kb.mp3","meta":{"duration":504,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_55_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_55_austen_64kb.mp3","meta":{"duration":734,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_56_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_56_austen_64kb.mp3","meta":{"duration":956,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_57_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_57_austen_64kb.mp3","meta":{"duration":529,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_58_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_58_austen_64kb.mp3","meta":{"duration":799,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_59_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_59_austen_64kb.mp3","meta":{"duration":807,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_60_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_60_austen_64kb.mp3","meta":{"duration":513,"bitrate":64},"mime":"audio/mpeg","section":null},{"name":"prideandprejudice_61_austen_64kb.mp3","path":"Austene Jane/Pride And Prejudice/prideandprejudice_61_austen_64kb.mp3","meta":{"duration":445,"bitrate":64},"mime":"audio/mpeg","section":null}],"subfolders":[],"cover":{"path":"Austene Jane/Pride And Prejudice/Pride-and-Prejudice-Jane-Austen.jpg","mime":"image/jpeg"},"description":{"path":"Austene Jane/Pride And Prejudice/info.txt","mime":"text/plain"}}')
  }
}

export default {
  name: 'App',
  components: {
    FolderDetails,
    FloatingLabelInput,
    Player
  },
  data () {
    return {
      group: 'Test',
      foldername: '',
      corsproxy: '',
      fake: fakeIt(),
      search: false,
      menu: false,
      searchterm: '',
      secret: ''
    }
  },

  computed: {
    isfake () {
      return this.$store.state.app.loginsecret === 'fakeit'
    },
    currentFolder () {
      return this.$route.query.folder || ''
    },
    loginStatus () {
      return this.$store.state.app.loginStatus
    },
    server () {
      return this.$store.state.app.server
    },
    folder () {
      return this.$store.state.app.folder
    },
    rightbar () {
      return this.$store.state.app.rightbar
    },
    loginsecret () {
      return this.$store.state.app.loginsecret
    },
    player () {
      return this.$store.state.app.player
    },
    breadcrumbs () {
      const breadcrumbs = [{
        name: 'Home',
        link: '/',
        active: false
      }]
      if (this.$route.query.folder) {
        if (this.$route.query.folder !== '/') {
          const segments = this.$route.query.folder.split('/')
          for (let i = 0; i < segments.length; i++) {
            breadcrumbs.push({
              name: segments[i],
              link: segments.slice(0, i + 1).join('/'),
              active: (i === segments.length - 1)
            })
          }
        }
      }
      return breadcrumbs
    }
  },

  watch: {
    '$route' (to, from) {
      if (to !== from) {
        if (to.query.folder) {
          this.fetchFolder(to.query.folder)
        } else {
          this.fetchFolder()
        }
      }
    },
    loginStatus (to, from) {
      if (to !== from) {
        if (to !== false) {
          this.fetchFolder(this.currentFolder)
        }
      }
    }
  },

  mounted () {
    this.$store.commit('app/initialiseApp')
    // this.fetchFolder()
  },

  methods: {
    async fetchFolder (name = '') {
      const folder = await this.$axios.$get(this.corsproxy + this.server + 'folder/' + name)
      this.$store.commit('app/folder', folder)
    },
    updateServer (input) {
      this.$store.commit('app/server', input)
    },
    fakeit () {
      this.$store.commit('app/loginsecret', 'fakeit')
      this.$store.commit('app/folder', this.fake.base)
    },
    selectFolder (subfolder) {
      this.$store.commit('app/folderDescription', '')
      this.$store.commit('app/player', false)
      this.$router.push({ path: '/', query: { folder: subfolder.path } })
      if (this.isfake) {
        this.$store.commit('app/folder', this.fake[encodeURIComponent(subfolder.name)])
        this.foldername = subfolder.name
      } else {
        this.fetchFolder(encodeURIComponent(subfolder.path))
      }
      // this.$store.commit('app/rightbar', true)
    },
    logout () {
      this.$store.commit('app/loginStatus', false)
    },
    login () {
      this.$store.dispatch('app/login', {
        server: this.server,
        group: this.group,
        secret: this.secret
      })
    }
  }
}
</script>
