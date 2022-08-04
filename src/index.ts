import { version } from '../package.json';
import { IConfigs } from '../interface/info';
interface queryData {
	apikey?: string;
	event?: string;
	performanceInfo?: PerformanceEntry;
	message?: string;
	stack?: string;
}

interface msgData {

}

class IllusionSDK {
	config: IConfigs | undefined;
	performanceInfo: PerformanceNavigationTiming;

	constructor (config: IConfigs) {
		this.config = config;
		this.performanceInfo = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
	}

	_URL () {
		return window.location.origin + window.location.pathname;
	}

	version () {
		return version;
	}

	// 常用是通过请求 img/scritp资源来避免跨域
	serd (url: string, query: queryData = {}) {
		query.apikey = this.config?.apikey;
		const querystr = Object.entries(query).map(([key, value]) => `${key}-${value}`).join('&');
		const img = new Image();
		img.src = `${url}?${querystr}`;
		console.log(img);
	}

	// WebAPI 新特 用于替代快要丢弃的 performance.timing
	sendBeacon (url: string, data: queryData = {}) {
		data.apikey = this.config?.apikey;
		const datastr = Object.entries(data).map(([key, value]) => `${key}-${value}`).join('&');
		return navigator.sendBeacon(url, datastr);
	}

	event (key: string, val: queryData = {}) {
		const eventURL = this._URL();
		this.serd(eventURL, { event: key, ...val });
	}

	// 页面的访问量
	pv () {
		const location = window.location;
		let oldURL = location.href;
		let oldPathName = location.pathname;
		let i = 0;
		setInterval(() => {
			const newURL = location.href;
			const newPathName = location.pathname;
			console.log('🚀 ~ file: index.ts ~ line 61 ~ IllusionSDK ~ setInterval ~ oldPathName', oldPathName);
			console.log('🚀 ~ file: index.ts ~ line 61 ~ IllusionSDK ~ setInterval ~ newPathName', newPathName);
			if (newPathName !== oldPathName) {
				oldURL = newURL;
				oldPathName = newPathName;
				i++;
				this.event('pv', { event: `pv${i}` });
			}
		}, 1000);
	}

	// 用户的访问量
	uv () {
		this.event('uv');
	}

	//  页面停留时间
	pageStay () {
		this.event('pageStay');
	}

	// 交互事件（点击，长按）
	// 逻辑事件（登录、跳转）
	// 页面首次渲染时间
	FP () {
		return this.performanceInfo.domComplete - this.performanceInfo.connectStart + 'ms';
	}

	DCL () {
		return this.performanceInfo.domContentLoadedEventEnd - this.performanceInfo.domContentLoadedEventStart + 'ms';
	}

	// TODO:
	// 页面首次渲染时间：FP(firstPaint)=domLoading-navigationStart
	// DOM加载完成：DCL(DOMContentEventLoad)=domContentLoadedEventEnd-navigationStart
	// 页面首次有内容渲染时间 FCP =domLoading-navigationStart
	// 页面首次有效渲染时间 FMP >= FCP
	// 最大内容渲染时间 LCP(Largest Contentful Paint)
	// 图片、样式等外链资源加载完成：L(Load)=loadEventEnd-navigationStart
	// 稳定性指标 CLS(Cumulative Layout Shift)
	// 流畅性指标 FPS
	// 总阻塞时间 TBT
	// 页面完成可交互时间 TTI
	// 页面加载阶段,用户首次交互操作的延时时间 FID
	// 页面加载阶段,用户交互操作可能遇到的最大延时时间 MPFID
	initPerformance () {
		const performanceURL = this._URL();
		// 新特性，用于取代 performance.timing
		const [performanceInfo] = performance.getEntriesByType('navigation');
		this.serd(performanceURL, performanceInfo as queryData);
	}

	// TODO:
	// InternalError: 内部错误，比如如递归爆栈;
	// RangeError: 范围错误，比如new Array(-1);
	// EvalError: 使用eval()时错误;
	// ReferenceError: 引用错误，比如使用未定义变量;
	// SyntaxError: 语法错误，比如var a = ;
	// TypeError: 类型错误，比如[1,2].split('.');
	// URIError:  给 encodeURI或 decodeURl()传递的参数无效，比如decodeURI('%2')
	// Error: 上面7种错误的基类，通常是开发者抛出
	error (err: Error, mes: msgData = {}) {
		const errorURL = this._URL();
		const { message, stack } = err;
		this.serd(errorURL, { message, stack, ...mes });
	}

	initError () {
		window.addEventListener('error', (event: ErrorEvent) => {
			this.error(event.error);
		});
		window.addEventListener('unhandledrejection', event => {
			this.error(new Error(event.reason), { type: 'unhandledrejection' });
		});
	}
};

export default IllusionSDK;
