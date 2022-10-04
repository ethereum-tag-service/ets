import { useStats } from "../hooks/useStats";
import useTranslation from "next-translate/useTranslation";

const Stats = () => {
  const { stats } = useStats({
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  });

  const { t } = useTranslation("common");

  return (
    <div>
      <dl className="grid w-full grid-cols-2 gap-6 mx-auto lg:grid-cols-4 lg:gap-12">
        <div className="rounded-md shadow-lg shadow-slate-400/20 ring-1 ring-slate-200">
          <a href="/tagging-records">
            <div className="relative h-32 px-6 pt-3 overflow-hidden rounded-md">
              <dt className="text-sm font-medium truncate text-slate-500">
                {t("tagging-records")}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-700">
                {stats && stats.taggingRecordsCount
                  ? stats.taggingRecordsCount
                  : null}
              </dd>
              <svg
                className="absolute bottom-0 left-0 w-full h-auto ml-1 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 200"
              >
                <path
                  className="text-pink-200"
                  fill="currentColor"
                  d="M 0,198.25222212176976 C 7.3999999999999995,197.7149828347821 22.2,197.3052798060722 37,195.56602568683138 C 51.8,193.82677156759055 59.2,191.73526997119367 74,189.5559515255656 C 88.8,187.37663307993756 96.2,186.82994383440322 111,184.66943345869112 C 125.8,182.508923082979 133.2,180.45663268001073 148,178.75339964700507 C 162.8,177.0501666139994 170.2,179.12177018251407 185,176.1532682936628 C 199.8,173.1847664048115 207.2,166.89629640349747 222,163.91089020274867 C 236.8,160.92548400199988 244.2,160.455550218261 259,161.2262372899188 C 273.8,161.9969243615766 281.2,172.44096432244717 296,167.7643255610376 C 310.8,163.08768679962802 318.2,139.41570494968144 333,137.84304348287094 C 347.8,136.27038201606044 355.2,162.7839482628587 370,159.90101822698506 C 384.8,157.01808819111142 392.2,127.89822490718431 407,123.42839330350273 C 421.8,118.95856169982115 429.2,135.0766126668243 444,137.55186020857715 C 458.8,140.02710775033 466.2,139.9313409031753 481,135.80463101226704 C 495.8,131.67792112135876 503.2,124.1539673603479 518,116.91831075403584 C 532.8,109.68265414772378 540.2,98.96045826860993 555,99.62634798070671 C 569.8,100.2922376928035 577.2,123.95095064558048 592,120.24775931451977 C 606.8,116.54456798345907 614.2,81.88359928143944 629,81.11039132540321 C 643.8,80.337183369367 651.2,112.25431555411275 666,116.38171953433866 C 680.8,120.50912351456456 688.2,111.7758556662393 703,101.74741122653275 C 717.8,91.7189667868262 725.2,64.05835424600804 740,66.23949733580594 C 754.8,68.42064042560385 762.2,104.21094688689243 777,112.65312667552229 C 791.8,121.09530646415215 799.2,109.68672400011472 814,108.45039627895522 C 828.8,107.21406855779574 836.2,118.03106779264544 851,106.47148806972486 C 865.8,94.91190834680427 873.2,52.13938399521963 888,50.652497664352325 C 902.8,49.16561133348502 910.2,96.8123814488676 925,99.03705641538832 C 939.8,101.26173138190904 947.2,60.6795015543715 962,61.77587249695597 C 976.8,62.87224343954044 991.6,95.97030340203972 999,104.51891112831066,L 1000 200,L 0 200Z"
                />
                <path
                  className="text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  d="M 0,198.25222212176976 C 7.3999999999999995,197.7149828347821 22.2,197.3052798060722 37,195.56602568683138 C 51.8,193.82677156759055 59.2,191.73526997119367 74,189.5559515255656 C 88.8,187.37663307993756 96.2,186.82994383440322 111,184.66943345869112 C 125.8,182.508923082979 133.2,180.45663268001073 148,178.75339964700507 C 162.8,177.0501666139994 170.2,179.12177018251407 185,176.1532682936628 C 199.8,173.1847664048115 207.2,166.89629640349747 222,163.91089020274867 C 236.8,160.92548400199988 244.2,160.455550218261 259,161.2262372899188 C 273.8,161.9969243615766 281.2,172.44096432244717 296,167.7643255610376 C 310.8,163.08768679962802 318.2,139.41570494968144 333,137.84304348287094 C 347.8,136.27038201606044 355.2,162.7839482628587 370,159.90101822698506 C 384.8,157.01808819111142 392.2,127.89822490718431 407,123.42839330350273 C 421.8,118.95856169982115 429.2,135.0766126668243 444,137.55186020857715 C 458.8,140.02710775033 466.2,139.9313409031753 481,135.80463101226704 C 495.8,131.67792112135876 503.2,124.1539673603479 518,116.91831075403584 C 532.8,109.68265414772378 540.2,98.96045826860993 555,99.62634798070671 C 569.8,100.2922376928035 577.2,123.95095064558048 592,120.24775931451977 C 606.8,116.54456798345907 614.2,81.88359928143944 629,81.11039132540321 C 643.8,80.337183369367 651.2,112.25431555411275 666,116.38171953433866 C 680.8,120.50912351456456 688.2,111.7758556662393 703,101.74741122653275 C 717.8,91.7189667868262 725.2,64.05835424600804 740,66.23949733580594 C 754.8,68.42064042560385 762.2,104.21094688689243 777,112.65312667552229 C 791.8,121.09530646415215 799.2,109.68672400011472 814,108.45039627895522 C 828.8,107.21406855779574 836.2,118.03106779264544 851,106.47148806972486 C 865.8,94.91190834680427 873.2,52.13938399521963 888,50.652497664352325 C 902.8,49.16561133348502 910.2,96.8123814488676 925,99.03705641538832 C 939.8,101.26173138190904 947.2,60.6795015543715 962,61.77587249695597 C 976.8,62.87224343954044 991.6,95.97030340203972 999,104.51891112831066"
                />
              </svg>
              <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-white/0 to-white"></div>
              <div className="hidden sm:flex absolute right-3 top-3 items-baseline px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                <svg
                  className="-ml-0.5 mr-0.5 flex-shrink-0 self-center h-3 w-3 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M17.25 10.25L12 4.75L6.75 10.25"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 19.25V5.75"
                  ></path>
                </svg>
                <span className="sr-only">Increased by</span>
                27%
              </div>
            </div>
          </a>
        </div>
        <div className="rounded-md shadow-lg shadow-slate-400/20 ring-1 ring-slate-200">
          <a href="/ctags">
            <div className="relative h-32 px-6 pt-3 overflow-hidden rounded-md">
              <dt className="text-sm font-medium truncate text-slate-500">
                {t("ctags")}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-700">
                {stats && stats.tagsCount ? stats.tagsCount : null}
              </dd>
              <svg
                className="absolute bottom-0 left-0 w-full h-auto ml-1 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 200"
              >
                <path
                  className="text-pink-200"
                  fill="currentColor"
                  d="M 0,199.4326620218839 C 10.600000000000001,198.37930279959176 31.8,198.39770553671676 53,194.16586591042307 C 74.2,189.93402628412937 84.8,181.29806568710114 106,178.2734638904155 C 127.2,175.24886209372988 137.8,182.50466498686072 159,179.0428569269949 C 180.2,175.58104886712906 190.8,167.34824415823522 212,160.96442359108642 C 233.2,154.5806030239376 243.8,147.3344038721921 265,147.12375409125093 C 286.2,146.91310431030976 296.8,160.0819586915671 318,159.91117468638055 C 339.2,159.740390681194 349.8,150.01503918673944 371,146.2698340653181 C 392.2,142.52462894389674 402.8,149.3025630849295 424,141.18514907927386 C 445.2,133.06773507361822 455.8,109.76674537360253 477,105.68276403703993 C 498.2,101.59878270047733 508.8,115.97439038482061 530,120.76524239646085 C 551.2,125.55609440810109 561.8,138.2168746186204 583,129.63702409524112 C 604.2,121.05717357186184 614.8,88.52538226282527 636,77.86598977956444 C 657.2,67.20659729630361 667.8,68.28459995024997 689,76.34006167893698 C 710.2,84.395523407624 720.8,117.215219722141 742,118.14329842299952 C 763.2,119.07137712385804 773.8,93.2969820816853 795,80.98045518322961 C 816.2,68.66392828477392 826.8,69.92861316886916 848,56.56066393072109 C 869.2,43.19271469257301 879.8,10.092647676441613 901,14.140708992489238 C 922.2,18.188770308536867 932.8,75.27813716596619 954,76.80097051095925 C 975.2,78.3238038559523 996.4,32.764094676155466 1007,21.754875717454524,L 1000 200,L 0 200Z"
                />
                <path
                  className="text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  d="M 0,199.4326620218839 C 10.600000000000001,198.37930279959176 31.8,198.39770553671676 53,194.16586591042307 C 74.2,189.93402628412937 84.8,181.29806568710114 106,178.2734638904155 C 127.2,175.24886209372988 137.8,182.50466498686072 159,179.0428569269949 C 180.2,175.58104886712906 190.8,167.34824415823522 212,160.96442359108642 C 233.2,154.5806030239376 243.8,147.3344038721921 265,147.12375409125093 C 286.2,146.91310431030976 296.8,160.0819586915671 318,159.91117468638055 C 339.2,159.740390681194 349.8,150.01503918673944 371,146.2698340653181 C 392.2,142.52462894389674 402.8,149.3025630849295 424,141.18514907927386 C 445.2,133.06773507361822 455.8,109.76674537360253 477,105.68276403703993 C 498.2,101.59878270047733 508.8,115.97439038482061 530,120.76524239646085 C 551.2,125.55609440810109 561.8,138.2168746186204 583,129.63702409524112 C 604.2,121.05717357186184 614.8,88.52538226282527 636,77.86598977956444 C 657.2,67.20659729630361 667.8,68.28459995024997 689,76.34006167893698 C 710.2,84.395523407624 720.8,117.215219722141 742,118.14329842299952 C 763.2,119.07137712385804 773.8,93.2969820816853 795,80.98045518322961 C 816.2,68.66392828477392 826.8,69.92861316886916 848,56.56066393072109 C 869.2,43.19271469257301 879.8,10.092647676441613 901,14.140708992489238 C 922.2,18.188770308536867 932.8,75.27813716596619 954,76.80097051095925 C 975.2,78.3238038559523 996.4,32.764094676155466 1007,21.754875717454524"
                />
              </svg>
              <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-white/0 to-white"></div>
              <div className="hidden sm:flex absolute right-3 top-3 items-baseline px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                <svg
                  className="-ml-0.5 mr-0.5 flex-shrink-0 self-center h-3 w-3 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M17.25 10.25L12 4.75L6.75 10.25"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 19.25V5.75"
                  ></path>
                </svg>
                <span className="sr-only">Increased by</span>
                12%
              </div>
            </div>
          </a>
        </div>

        <div className="rounded-md shadow-lg shadow-slate-400/20 ring-1 ring-slate-200">
          <a href="/publishers">
            <div className="relative h-32 px-6 pt-3 overflow-hidden rounded-md">
              <dt className="text-sm font-medium truncate text-slate-500">
                {t("publishers")}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-700">7</dd>
              <svg
                className="absolute bottom-0 left-0 w-full h-auto ml-1 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 200"
              >
                <path
                  className="text-pink-200"
                  fill="currentColor"
                  d="M 0,198.3979746913674 C 7.3999999999999995,197.8685522852402 22.199999999999996,196.9863135103665 37,195.75086266073143 C 51.800000000000004,194.51541181109636 59.2,194.1601423525027 74,192.2207204431921 C 88.8,190.2812985338815 96.2,187.42887492146005 111,186.05375311417845 C 125.8,184.67863130689685 133.2,189.505065072384 148,185.34511140678416 C 162.8,181.1851577411843 170.2,170.6139201540229 185,165.2539847861791 C 199.8,159.8940494183353 207.2,157.76221218130007 222,158.54543456756517 C 236.8,159.3286569538303 244.2,169.9370238851892 259,169.17009671750466 C 273.8,168.40316954982015 281.2,157.37262605816258 296,154.71079872914254 C 310.8,152.0489714001225 318.2,156.03058457086738 333,155.86096007240448 C 347.8,155.6913355739416 355.2,159.3256776590934 370,153.862676236828 C 384.8,148.39967481456262 392.2,132.4157195696055 407,128.5459529610775 C 421.8,124.67618635254948 429.2,132.57682586463466 444,134.51384319418796 C 458.8,136.45086052374126 466.2,136.4274895745368 481,138.23103960884396 C 495.8,140.03458964315112 503.2,145.30527100798795 518,143.53159336572384 C 532.8,141.75791572345972 540.2,129.7435422938897 555,129.3626513975233 C 569.8,128.9817605011569 577.2,144.44149777457918 592,141.6271388838919 C 606.8,138.8127799932046 614.2,122.96121503527756 629,115.29085694408687 C 643.8,107.62049885289618 651.2,104.04338328011939 666,103.27534842793843 C 680.8,102.50731357575746 688.2,116.59562093481308 703,111.4506826831821 C 717.8,106.3057444315511 725.2,84.55607305700524 740,77.55065716978349 C 754.8,70.54524128256175 762.2,76.973730956806 777,76.42360324707337 C 791.8,75.87347553734077 799.2,76.3030011189837 814,74.80001862112043 C 828.8,73.29703612325716 836.2,71.61654715281496 851,68.90869075775703 C 865.8,66.2008343626991 873.2,52.82211239006502 888,61.260736645830804 C 902.8,69.69936090159658 910.2,107.49928256614162 925,111.10181203658593 C 939.8,114.70434150703024 947.2,84.02451482071471 962,79.27338399805237 C 976.8,74.52225317539002 991.6,85.73160313822983 999,87.34615792327419,L 1000 200,L 0 200Z"
                />
                <path
                  className="text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  d="M 0,198.3979746913674 C 7.3999999999999995,197.8685522852402 22.199999999999996,196.9863135103665 37,195.75086266073143 C 51.800000000000004,194.51541181109636 59.2,194.1601423525027 74,192.2207204431921 C 88.8,190.2812985338815 96.2,187.42887492146005 111,186.05375311417845 C 125.8,184.67863130689685 133.2,189.505065072384 148,185.34511140678416 C 162.8,181.1851577411843 170.2,170.6139201540229 185,165.2539847861791 C 199.8,159.8940494183353 207.2,157.76221218130007 222,158.54543456756517 C 236.8,159.3286569538303 244.2,169.9370238851892 259,169.17009671750466 C 273.8,168.40316954982015 281.2,157.37262605816258 296,154.71079872914254 C 310.8,152.0489714001225 318.2,156.03058457086738 333,155.86096007240448 C 347.8,155.6913355739416 355.2,159.3256776590934 370,153.862676236828 C 384.8,148.39967481456262 392.2,132.4157195696055 407,128.5459529610775 C 421.8,124.67618635254948 429.2,132.57682586463466 444,134.51384319418796 C 458.8,136.45086052374126 466.2,136.4274895745368 481,138.23103960884396 C 495.8,140.03458964315112 503.2,145.30527100798795 518,143.53159336572384 C 532.8,141.75791572345972 540.2,129.7435422938897 555,129.3626513975233 C 569.8,128.9817605011569 577.2,144.44149777457918 592,141.6271388838919 C 606.8,138.8127799932046 614.2,122.96121503527756 629,115.29085694408687 C 643.8,107.62049885289618 651.2,104.04338328011939 666,103.27534842793843 C 680.8,102.50731357575746 688.2,116.59562093481308 703,111.4506826831821 C 717.8,106.3057444315511 725.2,84.55607305700524 740,77.55065716978349 C 754.8,70.54524128256175 762.2,76.973730956806 777,76.42360324707337 C 791.8,75.87347553734077 799.2,76.3030011189837 814,74.80001862112043 C 828.8,73.29703612325716 836.2,71.61654715281496 851,68.90869075775703 C 865.8,66.2008343626991 873.2,52.82211239006502 888,61.260736645830804 C 902.8,69.69936090159658 910.2,107.49928256614162 925,111.10181203658593 C 939.8,114.70434150703024 947.2,84.02451482071471 962,79.27338399805237 C 976.8,74.52225317539002 991.6,85.73160313822983 999,87.34615792327419"
                />
              </svg>
              <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-white/0 to-white"></div>
              <div className="hidden sm:flex absolute right-3 top-3 items-baseline px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                <svg
                  className="-ml-0.5 mr-0.5 flex-shrink-0 self-center h-3 w-3 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M17.25 10.25L12 4.75L6.75 10.25"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 19.25V5.75"
                  ></path>
                </svg>
                <span className="sr-only">Increased by</span>
                16%
              </div>
            </div>
          </a>
        </div>

        <div className="rounded-md shadow-lg shadow-slate-400/20 ring-1 ring-slate-200">
          <a href="/taggers">
            <div className="relative h-32 px-6 pt-3 overflow-hidden rounded-md">
              <dt className="text-sm font-medium truncate text-slate-500">
                {t("taggers")}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-700">2</dd>
              <svg
                className="absolute bottom-0 left-0 w-full h-auto ml-1 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 200"
              >
                <path
                  className="text-pink-200"
                  fill="currentColor"
                  d="M 0,199.2997718087719 C 7.4,198.22690455628958 22.2,195.7262927905441 37,193.93543554636028 C 51.8,192.14457830217646 59.2,191.61352783405326 74,190.34548558785272 C 88.8,189.07744334165218 96.2,190.95972289562 111,187.5952243153576 C 125.8,184.2307257350952 133.2,176.25479984615185 148,173.52299268654076 C 162.8,170.79118552692967 170.2,174.39095576754735 185,173.93618851730207 C 199.8,173.4814212670568 207.2,174.33241495665138 222,171.2491564353144 C 236.8,168.16589791397743 244.2,162.83274532506582 259,158.51989591061724 C 273.8,154.20704649616866 281.2,151.26163531255563 296,149.6849093630715 C 310.8,148.1081834135874 318.2,152.21028420346371 333,150.63626616319664 C 347.8,149.06224812292956 355.2,143.66880133381372 370,141.81481916173618 C 384.8,139.96083698965865 392.2,139.28000874958622 407,141.36635530280898 C 421.8,143.45270185603175 429.2,157.07899480040567 444,152.24655192785005 C 458.8,147.41410905529443 466.2,122.78918264801241 481,117.20414094003094 C 495.8,111.61909923204946 503.2,123.7318193034741 518,124.32134338794268 C 532.8,124.91086747241125 540.2,116.32700861417753 555,120.15176136237386 C 569.8,123.97651411057019 577.2,141.21851440634072 592,143.44510712892435 C 606.8,145.67169985150798 614.2,138.6742073439543 629,131.28472497529202 C 643.8,123.89524260662976 651.2,119.2012108659128 666,106.49769528561306 C 680.8,93.79417970531333 688.2,65.10089263545579 703,67.76714707379335 C 717.8,70.43340151213091 725.2,121.82656523089256 740,119.82896747730084 C 754.8,117.83136972370913 762.2,59.52496776050264 777,57.779158305834805 C 791.8,56.03334885116698 799.2,105.51263179050741 814,111.09992020396169 C 828.8,116.68720861741596 836.2,88.60537751304727 851,85.71560037310614 C 865.8,82.82582323316501 873.2,98.54809904434383 888,96.65103450425602 C 902.8,94.7539699641682 910.2,79.52235444915036 925,76.23027767266711 C 939.8,72.93820089618389 947.2,83.7916802960675 962,80.19065062183986 C 976.8,76.58962094761223 991.6,62.618233565591126 999,58.22512930152894,L 1000 200,L 0 200Z"
                />
                <path
                  className="text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  d="M 0,199.2997718087719 C 7.4,198.22690455628958 22.2,195.7262927905441 37,193.93543554636028 C 51.8,192.14457830217646 59.2,191.61352783405326 74,190.34548558785272 C 88.8,189.07744334165218 96.2,190.95972289562 111,187.5952243153576 C 125.8,184.2307257350952 133.2,176.25479984615185 148,173.52299268654076 C 162.8,170.79118552692967 170.2,174.39095576754735 185,173.93618851730207 C 199.8,173.4814212670568 207.2,174.33241495665138 222,171.2491564353144 C 236.8,168.16589791397743 244.2,162.83274532506582 259,158.51989591061724 C 273.8,154.20704649616866 281.2,151.26163531255563 296,149.6849093630715 C 310.8,148.1081834135874 318.2,152.21028420346371 333,150.63626616319664 C 347.8,149.06224812292956 355.2,143.66880133381372 370,141.81481916173618 C 384.8,139.96083698965865 392.2,139.28000874958622 407,141.36635530280898 C 421.8,143.45270185603175 429.2,157.07899480040567 444,152.24655192785005 C 458.8,147.41410905529443 466.2,122.78918264801241 481,117.20414094003094 C 495.8,111.61909923204946 503.2,123.7318193034741 518,124.32134338794268 C 532.8,124.91086747241125 540.2,116.32700861417753 555,120.15176136237386 C 569.8,123.97651411057019 577.2,141.21851440634072 592,143.44510712892435 C 606.8,145.67169985150798 614.2,138.6742073439543 629,131.28472497529202 C 643.8,123.89524260662976 651.2,119.2012108659128 666,106.49769528561306 C 680.8,93.79417970531333 688.2,65.10089263545579 703,67.76714707379335 C 717.8,70.43340151213091 725.2,121.82656523089256 740,119.82896747730084 C 754.8,117.83136972370913 762.2,59.52496776050264 777,57.779158305834805 C 791.8,56.03334885116698 799.2,105.51263179050741 814,111.09992020396169 C 828.8,116.68720861741596 836.2,88.60537751304727 851,85.71560037310614 C 865.8,82.82582323316501 873.2,98.54809904434383 888,96.65103450425602 C 902.8,94.7539699641682 910.2,79.52235444915036 925,76.23027767266711 C 939.8,72.93820089618389 947.2,83.7916802960675 962,80.19065062183986 C 976.8,76.58962094761223 991.6,62.618233565591126 999,58.22512930152894"
                />
              </svg>
              <div className="absolute bottom-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-white/0 to-white"></div>
              <div className="hidden sm:flex absolute right-3 top-3 items-baseline px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                <svg
                  className="-ml-0.5 mr-0.5 flex-shrink-0 self-center h-3 w-3 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M17.25 10.25L12 4.75L6.75 10.25"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 19.25V5.75"
                  ></path>
                </svg>
                <span className="sr-only">Increased by</span>
                31%
              </div>
            </div>
          </a>
        </div>
      </dl>
    </div>
  );
};

export { Stats };
