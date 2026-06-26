import UIKit
import Capacitor
import WebKit

/// CAPBridgeViewController 서브클래스 — iOS 네이티브 스와이프 뒤로가기 활성화
class BridgeViewController: CAPBridgeViewController {
    override open func viewDidLoad() {
        super.viewDidLoad()
        enableSwipeBackGesture()
    }

    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        enableSwipeBackGesture()
    }

    private func enableSwipeBackGesture() {
        guard let webView = webView as? WKWebView else { return }
        webView.allowsBackForwardNavigationGestures = true
    }
}
