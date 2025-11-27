import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Lock, Share2, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
            <span className="text-blue-600">Dividend</span>
            <span>Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              로그인
            </Link>
            <Link href="/signup">
              <Button>무료로 시작하기</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                배당 투자의 즐거움을 <br />
                <span className="text-blue-600">시각화</span>하세요
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
                복잡한 엑셀은 그만. 월별 배당금, 포트폴리오 비중, 목표 달성률을 
                아름다운 대시보드에서 한눈에 확인하세요.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base">
                    지금 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/p/sample">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    샘플 보기
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Dashboard Preview Image Placeholder */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-xl border bg-gray-50 p-2 shadow-2xl lg:p-4">
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-white">
                <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                  {/* Replace with actual screenshot later */}
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-4 font-medium">Dashboard Screenshot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="bg-gray-50 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                왜 Dividend Dashboard인가요?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                투자자를 위해 꼭 필요한 기능만 담았습니다.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={Zap}
                title="강력한 시각화"
                description="월별 예상 배당금과 포트폴리오 섹터 비중을 직관적인 차트로 제공합니다."
              />
              <FeatureCard
                icon={Share2}
                title="쉬운 공유"
                description="나만의 포트폴리오 링크를 생성하여 커뮤니티나 친구들에게 쉽게 공유하세요."
              />
              <FeatureCard
                icon={Lock}
                title="데이터 프라이버시"
                description="모든 데이터는 안전하게 암호화되며, 본인만 접근할 수 있습니다. (공개 설정 시 제외)"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              경제적 자유를 향한 여정, 함께하세요
            </h2>
            <p className="mb-8 text-blue-100 sm:text-lg">
              지금 가입하고 나만의 배당 로드맵을 그려보세요.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-blue-700">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Dividend Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

