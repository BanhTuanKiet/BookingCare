import bloodTest from "./bloodTest.png"
import dentistry from "./dentistry.png"
import ent from "./ent.png"
import gastroscopy from "./gastroscopy.png"
import generalExamination from "./generalExamination.png"
import ophthalmology from "./ophthalmology.png"
import pediatrics from "./pediatrics.png"
import supersonic from "./supersonic.png"
import xRay from "./xRay.png"

const images = {
    "Khám tổng quát": generalExamination,
    "Khám chuyên khoa Nội": dentistry,
    "Khám Nhi khoa" : pediatrics,
    "Khám Tai - Mũi - Họng": ent,
    "Khám mắt": ophthalmology,
    "Chụp X-quang": xRay,
    "Siêu âm tổng quát": supersonic,
    "Nội soi dạ dày": gastroscopy,
    "Xét nghiệm máu tổng quát": bloodTest 
}

export default images