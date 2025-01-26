import autohome_byd_han_res_module from '@/data/autohome/byd_han/res_module.json'
import autohome_lixiang_l6_res_module from '@/data/autohome/lixiang_l6/res_module.json'
import autohome_wenjie_m7_res_module from '@/data/autohome/wenjie_m7/res_module.json'
import autohome_yinhe_e8_res_module from '@/data/autohome/yinhe_e8/res_module.json'
import bili_byd_han_res_module from '@/data/bili/byd_han/res_module.json'
import bili_lixiang_l6_res_module from '@/data/bili/lixiang_l6/res_module.json'
import bili_wenjie_m7_res_module from '@/data/bili/wenjie_m7/res_module.json'
import bili_yinhe_e8_res_module from '@/data/bili/yinhe_e8/res_module.json'
import dongchedi_byd_han_res_module from '@/data/dongchedi/byd_han/res_module.json'
import dongchedi_lixiang_l6_res_module from '@/data/dongchedi/lixiang_l6/res_module.json'
import dongchedi_wenjie_m7_res_module from '@/data/dongchedi/wenjie_m7/res_module.json'
import dongchedi_yinhe_e8_res_module from '@/data/dongchedi/yinhe_e8/res_module.json'
import weibo_byd_han_res_module from '@/data/weibo/byd_han/res_module.json'
import weibo_lixiang_l6_res_module from '@/data/weibo/lixiang_l6/res_module.json'
import weibo_wenjie_m7_res_module from '@/data/weibo/wenjie_m7/res_module.json'
import weibo_yinhe_e8_res_module from '@/data/weibo/yinhe_e8/res_module.json'

import byd_han_theme_analysis from '@/data/merged/byd_han/merged_theme_analysis.json'
import lixiang_l6_theme_analysis from '@/data/merged/lixiang_l6/merged_theme_analysis.json'
import wenjie_m7_theme_analysis from '@/data/merged/wenjie_m7/merged_theme_analysis.json'
import yinhe_e8_theme_analysis from '@/data/merged/yinhe_e8/merged_theme_analysis.json'

export const res_module_data = {
  autohome: {
    yinhe_e8: autohome_yinhe_e8_res_module,
    byd_han: autohome_byd_han_res_module,
    wenjie_m7: autohome_wenjie_m7_res_module,
    lixiang_l6: autohome_lixiang_l6_res_module,
  },
  bili: {
    yinhe_e8: bili_yinhe_e8_res_module,
    byd_han: bili_byd_han_res_module,
    wenjie_m7: bili_wenjie_m7_res_module,
    lixiang_l6: bili_lixiang_l6_res_module,
  },
  weibo: {
    yinhe_e8: weibo_yinhe_e8_res_module,
    byd_han: weibo_byd_han_res_module,
    wenjie_m7: weibo_wenjie_m7_res_module,
    lixiang_l6: weibo_lixiang_l6_res_module,
  },
  dongchedi: {
    yinhe_e8: dongchedi_yinhe_e8_res_module,
    byd_han: dongchedi_byd_han_res_module,
    wenjie_m7: dongchedi_wenjie_m7_res_module,
    lixiang_l6: dongchedi_lixiang_l6_res_module,
  },
}

export const theme_analysis = {
  byd_han: byd_han_theme_analysis,
  lixiang_l6: lixiang_l6_theme_analysis,
  wenjie_m7: wenjie_m7_theme_analysis,
  yinhe_e8: yinhe_e8_theme_analysis,
}
