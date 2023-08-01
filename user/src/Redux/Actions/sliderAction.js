import request from '../../utils/request';
import { SLIDER_FAIL, SLIDER_REQUEST, SLIDER_SUCCESS } from '../Constants/SliderConstants';
export const ListSlider = () => async (dispatch) => {
    try {
        dispatch({ type: SLIDER_REQUEST });
        const { data } = await request.get(`/api/slider`);
        dispatch({ type: SLIDER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: SLIDER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
