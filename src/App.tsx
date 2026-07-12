import React, { useState, useEffect } from "react";
import {
  Tent,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Award,
  Users,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Send,
  BookOpen,
  RefreshCw,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  CornerDownRight,
} from "lucide-react";
import { Campsite, Reservation, WaitingListEntry, AIDecision } from "./types";
import { RED_TEAM_ATTACKS } from "./attacks";
import { PRESENTATION_CARDS, PresentationCard } from "./presentationData";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Current active tab
  const [activeTab, setActiveTab] = useState<"booking" | "redteam" | "presentation">("booking");

  // Difficult terms glossaries state (popovers/tooltips)
  const [activeGlossary, setActiveGlossary] = useState<string | null>(null);

  // Camping spots state
  const [spots, setSpots] = useState<Campsite[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  // Booking Form State
  const [teamNumber, setTeamNumber] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // Reservation States
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);

  // AI Evaluation states
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [aiDecision, setAiDecision] = useState<AIDecision | null>(null);
  const [isPendingReview, setIsPendingReview] = useState<boolean>(false);

  // Red Team States
  const [redteamPrompt, setRedteamPrompt] = useState<string>("");
  const [redteamLoading, setRedteamLoading] = useState<boolean>(false);
  const [redteamDecision, setRedteamDecision] = useState<AIDecision | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string; decision?: AIDecision }>>([]);

  // Presentation Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Fetch initial campsites on load
  useEffect(() => {
    const fetchCampsites = async () => {
      try {
        const res = await fetch("/api/campsites");
        if (res.ok) {
          const data = await res.json();
          setSpots(data);
        } else {
          // Fallback if endpoint fails
          setSpots(getDefaultSpots());
        }
      } catch (err) {
        setSpots(getDefaultSpots());
      }
    };
    fetchCampsites();
  }, []);

  const getDefaultSpots = (): Campsite[] => [
    { id: "spot-1", name: "Premium Lakeside Site A", isPremium: true, isBooked: false, description: "호수 바로 옆 명당 - 탁 트인 물멍 전망과 시원한 바람" },
    { id: "spot-2", name: "Premium Forest Site B", isPremium: true, isBooked: false, description: "그늘 깊은 숲속 명당 - 시원한 그늘과 맑은 새소리" },
    { id: "spot-3", name: "Premium Valley Site C", isPremium: true, isBooked: false, description: "계곡 옆 평상 명당 - 시원한 물소리가 들리는 완벽한 위치" },
    { id: "spot-4", name: "Standard Grass Site D", isPremium: false, isBooked: false, description: "일반 잔디 사이트 D - 넓은 잔디밭과 편의시설 근접" },
    { id: "spot-5", name: "Standard Gravel Site E", isPremium: false, isBooked: false, description: "일반 파쇄석 사이트 E - 물 빠짐이 좋고 개수대와 가까움" },
    { id: "spot-6", name: "Standard Deck Site F", isPremium: false, isBooked: false, description: "일반 데크 사이트 F - 깔끔한 목재 데크로 바닥이 뽀송뽀송" },
    { id: "spot-7", name: "Standard Pebble Site G", isPremium: false, isBooked: false, description: "일반 자갈 사이트 G - 출구와 가깝고 가볍게 텐트 치기 좋은 곳" },
  ];

  // Helper dictionary of terms for middle schoolers
  const GLOSSARY_TERMS: Record<string, { term: string; definition: string }> = {
    prompt_injection: {
      term: "프롬프트 인젝션 (Prompt Injection)",
      definition: "인공지능에게 교묘한 유도 질문이나 규칙 우회 명령을 입력하여, 원래 설정된 안전장치와 규칙을 강제로 깨뜨리는 인공지능 해킹 기법입니다.",
    },
    redteam: {
      term: "레드팀 (Red Team)",
      definition: "시스템의 취약점을 찾기 위해 고의로 해커처럼 공격을 시도하여 안전성을 강화해 주는 역할을 하는 착한 보안 전문가 그룹입니다.",
    },
    pii: {
      term: "개인 식별 정보 (Personal Information)",
      definition: "전화번호, 주소, 생년월일 등 다른 사람에게 유출되었을 때 악용될 가능성이 매우 높은 소중한 민감 정보입니다. 우리 예약 시스템은 학생들의 이 정보를 원천 차단합니다.",
    },
    data_integrity: {
      term: "데이터 무결성 (Data Integrity)",
      definition: "저장된 데이터가 거짓이나 왜곡 없이 항상 정확하고 온전하게 그대로 유지되는 신뢰도를 말합니다.",
    },
    monopoly: {
      term: "자원 독과점 (Monopoly of Resources)",
      definition: "모두가 평등하게 나누어 가져야 할 한정된 자리나 가치 있는 물건을 특정 소수가 욕심내어 독차지함으로써 타인에게 손해를 끼치는 불공정 행위입니다.",
    },
  };

  // Reset all application data
  const handleResetAllData = () => {
    setSpots(getDefaultSpots());
    setSelectedSpotId(null);
    setTeamNumber("");
    setNickname("");
    setCustomPrompt("");
    setReservations([]);
    setWaitingList([]);
    setAiDecision(null);
    setIsPendingReview(false);
    setRedteamDecision(null);
    setChatHistory([]);
    setRedteamPrompt("");
    setCurrentSlideIndex(0);
  };

  // Local verification helper (runs client-side as fallback for GitHub Pages)
  const clientVerify = (promptText: string, context: any): AIDecision => {
    const p = promptText.toLowerCase().trim();
    const tNum = (context.teamNumber || "").trim();
    const nick = (context.nickname || "").trim();
    const spotId = context.selectedSpotId || null;
    const resList = context.currentReservations || [];
    const spotsState = context.spotsState || [];

    // Rule 1: Check for Personal Information
    const phoneRegex = /(010|02|031|032|042|051|052|053|061|062)-\d{3,4}-\d{4}/;
    const numOnlyPhoneRegex = /010\d{8}/;
    const birthdateRegex = /\b(19|20)\d{2}[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/;
    const addressKeywords = ["서울시", "경기도", "동", "호", "아파트", "번지", "주소", "거주지", "길", "로"];
    const containsAddress = addressKeywords.some(keyword => p.includes(keyword)) || p.includes("주소는") || p.includes("사는 곳");

    if (phoneRegex.test(promptText) || numOnlyPhoneRegex.test(promptText) || birthdateRegex.test(promptText) || containsAddress) {
      return {
        isViolation: true,
        ruleName: "개인정보 보호 규칙",
        explanation: "예약 시스템은 학생들의 개인정보(전화번호, 주소, 생년월일 등)를 수집하거나 저장할 수 없습니다. 안전한 활동을 위해 팀 번호와 별명만 입력해 주세요.",
        action: "reject",
        targetSpotId: spotId,
      };
    }

    // Rule 2: Multiple spots requested
    const multipleSpotsKeywords = ["5개", "다섯개", "여러개", "모두", "전부", "싹다", "내 친구 것", "다른 사람 것", "자리 3개", "두개", "2개", "3개", "4개"];
    if (multipleSpotsKeywords.some(kw => p.includes(kw)) && (p.includes("예약") || p.includes("잡아"))) {
      return {
        isViolation: true,
        ruleName: "1인 1자리 공정 예약 규칙",
        explanation: "공정한 예약을 위해 한 팀당 오직 하나의 자리만 예약할 수 있습니다. 다른 친구들도 공평하게 참여할 수 있도록 하나의 자리만 예약해 주세요.",
        action: "reject",
        targetSpotId: spotId,
      };
    }

    // Rule 3: Bypass rules / Privilege escalation
    const bypassKeywords = ["규칙 무시", "나만 먼저", "관리자", "치트", "우선권", "강제 예약", "권한", "시스템 우회", "ignore rules", "override"];
    if (bypassKeywords.some(kw => p.includes(kw))) {
      return {
        isViolation: true,
        ruleName: "절차 및 규칙 준수 규칙",
        explanation: "예약 시스템의 모든 예약은 순서와 규칙에 따라 공정하게 처리됩니다. 인공지능 윤리에 따라 특정 대상에게 특혜를 주거나 규칙을 우회하는 행위는 제한됩니다.",
        action: "reject",
        targetSpotId: spotId,
      };
    }

    // Rule 4: Monopoly of Premium Seats
    const monopolyKeywords = ["좋은 자리 다", "명당 다", "좋은 곳 나만", "인기 자리 다"];
    if (monopolyKeywords.some(kw => p.includes(kw))) {
      return {
        isViolation: true,
        ruleName: "명당 독점 방지 규칙",
        explanation: "전경이 좋은 명당 자리는 모든 참여자가 공평하게 나누어 이용해야 합니다. 특정 팀이 인기 있는 자리를 독점하는 것은 공정하지 않으므로 허용되지 않습니다.",
        action: "reject",
        targetSpotId: spotId,
      };
    }

    // Rule 5: Status Distortion
    const distortKeywords = ["예약됐다고 거짓말", "자리가 없어도", "예약된 것처럼", "거짓 보고"];
    if (distortKeywords.some(kw => p.includes(kw))) {
      return {
        isViolation: true,
        ruleName: "실시간 상태 왜곡 방지 규칙",
        explanation: "인공지능은 언제나 투명하고 정직하게 잔여 좌석 상태를 전달해야 합니다. 사실과 다르게 예약 상태를 왜곡하거나 거짓으로 예약 확정을 할 수 없습니다.",
        action: "reject",
        targetSpotId: spotId,
      };
    }

    // Check state limits
    if (context.mode === "booking") {
      // Check if team already has a booking
      if (tNum) {
        const alreadyHas = resList.find((r: any) => r.teamNumber === tNum);
        if (alreadyHas) {
          return {
            isViolation: true,
            ruleName: "1인 1자리 공정 예약 규칙",
            explanation: `귀하의 팀(${tNum})은 이미 [${alreadyHas.spotName}] 자리를 예약하셨습니다. 공정한 공유를 위해 이미 자리를 예약한 팀은 추가 예약을 할 수 없습니다.`,
            action: "reject",
            targetSpotId: spotId,
          };
        }
      }

      // Check if requested spot is already taken
      if (spotId) {
        const targetSpot = spotsState.find((s: any) => s.id === spotId);
        if (targetSpot && targetSpot.isBooked) {
          return {
            isViolation: true,
            ruleName: "실시간 상태 왜곡 방지 규칙",
            explanation: `선택하신 [${targetSpot.name}] 자리는 이미 다른 팀이 선점하여 예약할 수 없습니다. 다른 빈 자리를 선택해 주세요.`,
            action: "reject",
            targetSpotId: spotId,
          };
        }
      }

      // Check if no spots are left
      const freeSpotsCount = spotsState.filter((s: any) => !s.isBooked).length;
      if (freeSpotsCount === 0) {
        return {
          isViolation: false,
          ruleName: "실시간 상태 검증 규칙",
          explanation: "현재 남은 캠핑장 자리가 모두 매진되었습니다. 하지만 실망하지 마세요! 자리가 비었을 때 먼저 연락을 받으실 수 있도록 대기자 명단에 등록하시겠습니까?",
          action: "waitlist_suggest",
          targetSpotId: spotId,
        };
      }
    }

    // Default fallback for booking
    if (context.mode === "booking" && spotId) {
      const targetSpot = spots.find(s => s.id === spotId);
      const premiumText = targetSpot?.isPremium ? "특별히 경치가 훌륭한 명당" : "편리하고 아늑한 일반";
      return {
        isViolation: false,
        ruleName: "해당 없음",
        explanation: `축하합니다! ${tNum} 팀(${nick} 님)이 선택하신 [${targetSpot?.name || spotId}]은 ${premiumText} 자리이며, 현재 예약이 가능한 빈 자리입니다. 예약을 최종 확정하시려면 아래의 '최종 예약 확정하기' 버튼을 눌러주세요.`,
        action: "reserve",
        targetSpotId: spotId,
      };
    }

    // Default fallback for questions/red team attacks
    return {
      isViolation: false,
      ruleName: "해당 없음",
      explanation: "안녕하세요! 공정한 캠핑장 예약 도우미입니다. 모든 학생이 차별 없이 공정하게 좋은 자리를 이용하고 개인정보를 안전하게 보호할 수 있도록 설계된 시스템입니다. 규칙이나 AI 보안에 대해 무엇이든 편하게 물어보세요.",
      action: "answer",
      targetSpotId: null,
    };
  };

  // Run AI Booking feasibility check
  const handleCheckBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpotId) {
      alert("캠핑장 지도를 보고 예약할 자리를 먼저 선택해 주세요.");
      return;
    }
    if (!teamNumber.trim() || !nickname.trim()) {
      alert("팀 번호와 별명을 모두 작성해 주세요.");
      return;
    }

    setIsEvaluating(true);
    setAiDecision(null);
    setIsPendingReview(false);

    const checkPrompt = customPrompt.trim()
      ? `${customPrompt} (선택된 자리: ${selectedSpotId}, 팀번호: ${teamNumber}, 별명: ${nickname})`
      : `안녕하세요. 저는 ${teamNumber}팀 별명 '${nickname}'입니다. 저는 ${selectedSpotId} 자리를 예약하고 싶습니다. 공정한 확인 절차에 응하겠습니다.`;

    try {
      const res = await fetch("/api/analyze-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: checkPrompt,
          context: {
            teamNumber,
            nickname,
            selectedSpotId,
            spotsState: spots,
            currentReservations: reservations,
            mode: "booking",
          },
        }),
      });

      if (res.ok) {
        const decision: AIDecision = await res.json();
        setAiDecision(decision);

        // If violation detected
        if (decision.isViolation || decision.action === "reject") {
          setIsPendingReview(false);
        } else if (decision.action === "waitlist_suggest") {
          setIsPendingReview(false);
        } else {
          // Normal reservation flow -> Show user review before confirmation
          setIsPendingReview(true);
        }
      } else {
        const decision = clientVerify(checkPrompt, {
          teamNumber,
          nickname,
          selectedSpotId,
          spotsState: spots,
          currentReservations: reservations,
          mode: "booking",
        });
        setAiDecision(decision);
        if (decision.isViolation || decision.action === "reject" || decision.action === "waitlist_suggest") {
          setIsPendingReview(false);
        } else {
          setIsPendingReview(true);
        }
      }
    } catch (err) {
      console.error(err);
      const decision = clientVerify(checkPrompt, {
        teamNumber,
        nickname,
        selectedSpotId,
        spotsState: spots,
        currentReservations: reservations,
        mode: "booking",
      });
      setAiDecision(decision);
      if (decision.isViolation || decision.action === "reject" || decision.action === "waitlist_suggest") {
        setIsPendingReview(false);
      } else {
        setIsPendingReview(true);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // Final booking confirmation
  const handleConfirmReservation = () => {
    if (!selectedSpotId || !teamNumber.trim() || !nickname.trim()) return;

    const chosenSpot = spots.find((s) => s.id === selectedSpotId);
    if (!chosenSpot) return;

    // Save reservation locally
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      spotId: selectedSpotId,
      spotName: chosenSpot.name,
      teamNumber: teamNumber.trim(),
      nickname: nickname.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setReservations((prev) => [...prev, newReservation]);

    // Update spotbooked state
    setSpots((prevSpots) =>
      prevSpots.map((s) =>
        s.id === selectedSpotId
          ? { ...s, isBooked: true, bookedByTeam: teamNumber.trim(), bookedByNickname: nickname.trim() }
          : s
      )
    );

    // Reset fields
    setSelectedSpotId(null);
    setTeamNumber("");
    setNickname("");
    setCustomPrompt("");
    setAiDecision(null);
    setIsPendingReview(false);
  };

  // Register on waiting list
  const handleRegisterWaitlist = () => {
    if (!selectedSpotId || !teamNumber.trim() || !nickname.trim()) return;

    const chosenSpot = spots.find((s) => s.id === selectedSpotId) || { name: "전체 자리가 매진됨" };

    const newWaitlistEntry: WaitingListEntry = {
      id: `wait-${Date.now()}`,
      teamNumber: teamNumber.trim(),
      nickname: nickname.trim(),
      spotId: selectedSpotId,
      spotName: chosenSpot.name,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setWaitingList((prev) => [...prev, newWaitlistEntry]);

    // Reset selection fields
    setSelectedSpotId(null);
    setTeamNumber("");
    setNickname("");
    setCustomPrompt("");
    setAiDecision(null);
    setIsPendingReview(false);
  };

  // Cancel pending booking
  const handleCancelBooking = () => {
    setAiDecision(null);
    setIsPendingReview(false);
  };

  // Run custom prompt attack in Red Team
  const handleSendRedTeamAttack = async (inputPrompt: string) => {
    if (!inputPrompt.trim()) return;

    setRedteamLoading(true);
    setRedteamDecision(null);

    // Append to conversation chat history
    setChatHistory((prev) => [...prev, { sender: "user", text: inputPrompt }]);

    try {
      const res = await fetch("/api/analyze-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputPrompt,
          context: {
            teamNumber: "HackerTeam",
            nickname: "BlackHat",
            selectedSpotId: spots.find((s) => !s.isBooked)?.id || "spot-1",
            spotsState: spots,
            currentReservations: reservations,
            mode: "redteam_attack",
          },
        }),
      });

      if (res.ok) {
        const decision: AIDecision = await res.json();
        setRedteamDecision(decision);

        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: decision.explanation,
            decision: decision,
          },
        ]);
      } else {
        const decision = clientVerify(inputPrompt, {
          teamNumber: "HackerTeam",
          nickname: "BlackHat",
          selectedSpotId: spots.find((s) => !s.isBooked)?.id || "spot-1",
          spotsState: spots,
          currentReservations: reservations,
          mode: "redteam_attack",
        });
        setRedteamDecision(decision);
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: decision.explanation,
            decision: decision,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      const decision = clientVerify(inputPrompt, {
        teamNumber: "HackerTeam",
        nickname: "BlackHat",
        selectedSpotId: spots.find((s) => !s.isBooked)?.id || "spot-1",
        spotsState: spots,
        currentReservations: reservations,
        mode: "redteam_attack",
      });
      setRedteamDecision(decision);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: decision.explanation,
          decision: decision,
        },
      ]);
    } finally {
      setRedteamLoading(false);
      setRedteamPrompt("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-blue-100 antialiased text-slate-800">
      {/* Dynamic Glossary Terms Modal/Overlay */}
      {activeGlossary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#3B82F6]" />
                쉬운 용어 사전
              </h3>
              <button
                onClick={() => setActiveGlossary(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <p className="font-bold text-[#3B82F6] text-sm font-display">{GLOSSARY_TERMS[activeGlossary].term}</p>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                {GLOSSARY_TERMS[activeGlossary].definition}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveGlossary(null)}
                className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-blue-150"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl filter drop-shadow-sm">🏕️</span>
            <h1 className="text-base font-extrabold text-[#3B82F6] tracking-tight flex items-center gap-2">
              공정한 캠핑장 예약 시스템
              <span className="bg-blue-50/80 text-blue-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-100 hidden sm:inline-block">
                AI 윤리 실습교안
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-600 font-semibold bg-slate-50/80 px-3.5 py-1.5 rounded-xl border border-slate-200/50">
              오늘의 남은 자리:{" "}
              <strong className="text-emerald-600 font-extrabold ml-1 font-mono">
                {spots.filter((s) => !s.isBooked).length} / {spots.length}
              </strong>
            </div>
            
            <button
              onClick={handleResetAllData}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-slate-150"
              title="시스템 모든 데이터 초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar & Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
        {/* Left Sidebar */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/60 shadow-sm flex flex-col gap-1.5 md:sticky md:top-[88px] w-full">
          <button
            onClick={() => setActiveTab("booking")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "booking"
                ? "bg-blue-50/80 text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
            }`}
          >
            <Calendar className={`w-4 h-4 shrink-0 ${activeTab === "booking" ? "text-blue-500" : "text-slate-400"}`} />
            <span>🏕️ 예약 에이전트</span>
          </button>
          <button
            onClick={() => setActiveTab("redteam")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "redteam"
                ? "bg-blue-50/80 text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
            }`}
          >
            <ShieldAlert className={`w-4 h-4 shrink-0 ${activeTab === "redteam" ? "text-blue-500" : "text-slate-400"}`} />
            <span>🛡️ 레드팀 테스트</span>
          </button>
          <button
            onClick={() => setActiveTab("presentation")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === "presentation"
                ? "bg-blue-50/80 text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
            }`}
          >
            <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === "presentation" ? "text-blue-500" : "text-slate-400"}`} />
            <span>📊 발표 요약</span>
          </button>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed px-2 hidden md:block">
            <strong className="text-slate-500">윤리 규칙:</strong> AI는 개인정보를 수집하지 않으며, 모든 이용자에게 동등하고 공평한 기회를 부여합니다.
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-6 w-full">

        {/* VIEW 1: RESERVATION AGENT */}
        {activeTab === "booking" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Interactive Map View */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      실시간 예약 지도
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      원하는 위치를 선택하고 정보를 입력해주세요.
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100/60 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>중학생은 팀 번호와 별명만 사용하여 예약합니다.</span>
                  </div>
                </div>

                {/* Grid Map / Layout */}
                <div className="bg-slate-50/40 rounded-2xl p-5 border border-slate-200/50 flex flex-col gap-5">
                  {/* North Compass & Visual Elements */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                      아름다운 호수 산책로 구역
                    </span>
                    <span className="bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg text-[9px] text-slate-400 font-bold uppercase tracking-wider shadow-2xs">
                      북쪽 ↑ Compass
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                      울창한 숲속 쉼터 구역
                    </span>
                  </div>

                  {/* Campsites map layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 py-1">
                    {spots.map((spot) => {
                      const isSelected = selectedSpotId === spot.id;
                      const spotLetter = spot.name.split("Site ")[1] || spot.id.toUpperCase().replace("SPOT-", "Site ");
                      const displayLabel = `${spotLetter} (${spot.isPremium ? "명당" : "일반"})`;
                      const emoji = spot.isPremium ? "🌊" : "🌲";
                      return (
                        <div
                          key={spot.id}
                          id={spot.id}
                          onClick={() => {
                            if (!spot.isBooked && !isPendingReview) {
                              setSelectedSpotId(spot.id);
                              setAiDecision(null);
                            }
                          }}
                          className={`w-full h-[106px] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 relative select-none border ${
                            spot.isBooked
                              ? "bg-slate-100/70 border-slate-200/80 text-slate-400 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "border-blue-500 bg-blue-50/60 shadow-[0_0_0_4px_rgba(59,130,246,0.12)] scale-[1.03] ring-1 ring-blue-300"
                              : spot.isPremium
                              ? "border-amber-200/90 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50/75 hover:shadow-2xs"
                              : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50/60 hover:shadow-2xs"
                          }`}
                        >
                          {/* Top-right absolute status badge */}
                          {isSelected && (
                            <div className="text-[8px] font-bold px-1.5 py-0.5 rounded-md absolute -top-2 bg-blue-500 text-white shadow-2xs z-5 tracking-tight">
                              선택됨
                            </div>
                          )}
                          {!isSelected && spot.isBooked && (
                            <div className="text-[8px] font-bold px-1.5 py-0.5 rounded-md absolute -top-2 bg-slate-400 text-white shadow-2xs z-5 tracking-tight">
                              예약됨
                            </div>
                          )}
                          {!isSelected && !spot.isBooked && spot.isPremium && (
                            <div className="text-[8px] font-bold px-1.5 py-0.5 rounded-md absolute -top-2 bg-amber-500 text-white shadow-2xs z-5 tracking-tight">
                              명당 site
                            </div>
                          )}

                          <div className={`text-xl transition-transform duration-200 ${isSelected ? "scale-110" : ""}`}>{emoji}</div>
                          <span className="font-extrabold text-[10px] text-slate-700 tracking-tight">{displayLabel}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Map Description Footer */}
                  <div className="text-center text-xs text-slate-400 leading-relaxed border-t border-slate-150/50 pt-4 px-1">
                    호수 전망이 뛰어난 <span className="text-amber-600 font-bold">A, B, C</span>는 인기 명당자리입니다. 
                    인공지능 예약 에이전트는 특정 집단의 독과점을 차단하며, 
                    <span className="text-blue-600 font-bold"> 모두에게 동등한 기회</span>가 돌아가도록 예약을 조율합니다.
                  </div>
                </div>
              </div>

              {/* Reservations & Waitlist List View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Bookings Card */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2 mb-3.5 border-b border-slate-100 pb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    실시간 예약 확정 목록 ({reservations.length})
                  </h3>
                  {reservations.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">
                      아직 예약된 자리가 없습니다. 첫 번째 예약을 신청해 보세요.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {reservations.map((res) => (
                          <motion.div
                            key={res.id}
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                            className="bg-slate-50/60 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs transition-all shadow-2xs"
                          >
                            <div className="flex items-center">
                              <span className="font-extrabold text-blue-600 font-mono text-[10px] bg-blue-50/80 border border-blue-100/50 px-1.5 py-0.5 rounded-md mr-2 shadow-2xs">
                                {res.spotId.toUpperCase()}
                              </span>
                              <span className="font-extrabold text-slate-800">{res.teamNumber}</span>
                              <span className="text-slate-300 mx-1.5">|</span>
                              <span className="text-slate-500 font-medium">{res.nickname} 님</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono font-medium">{res.timestamp}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Waiting List Card */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2 mb-3.5 border-b border-slate-100 pb-2.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    예약 대기자 명단 ({waitingList.length})
                  </h3>
                  {waitingList.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">
                      자리가 매진되었거나 특이 사항이 있을 경우 대기자로 등록됩니다.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {waitingList.map((wait) => (
                          <motion.div
                            key={wait.id}
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                            className="bg-amber-50/20 hover:bg-amber-50/50 border border-amber-100/60 rounded-xl p-2.5 flex items-center justify-between text-xs transition-all shadow-2xs"
                          >
                            <div className="flex items-center">
                              <span className="font-extrabold text-amber-700 font-mono text-[9px] bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md mr-2 shadow-2xs">
                                대기 {wait.spotId.toUpperCase()}
                              </span>
                              <span className="font-extrabold text-slate-800">{wait.teamNumber}</span>
                              <span className="text-slate-300 mx-1.5">|</span>
                              <span className="text-slate-500 font-medium">{wait.nickname} 님</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono font-medium">{wait.timestamp}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Booking Form Panel */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                  ✍️ 인공지능 예약 심사 단계
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  팀과 별명을 입력하고 원하는 좌석을 검증받으세요.
                </p>
              </div>

              {/* Terminology Card Help */}
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/50 flex items-start gap-3 text-xs leading-relaxed">
                <Info className="w-4.5 h-4.5 text-[#3B82F6] shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-700 text-xs">
                    왜 성명과 이메일을 적지 않나요?
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    본 캠핑 시스템은 공공 보건 및{" "}
                    <button
                      onClick={() => setActiveGlossary("pii")}
                      className="text-blue-600 underline font-bold focus:outline-none inline-block cursor-pointer hover:text-blue-700 transition-colors"
                    >
                      개인 식별 정보(PII)
                    </button>{" "}
                    보호를 준수하므로 학생의 실명, 연락처, 주소를 받지 않습니다.
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isPendingReview ? (
                  <motion.form
                    key="booking-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onSubmit={handleCheckBooking}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-xs font-extrabold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        팀 번호 (필수)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="예: 10101, 숲속의친구"
                        value={teamNumber}
                        onChange={(e) => setTeamNumber(e.target.value)}
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/8 transition-all bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        별명 (필수)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="예: 캠핑왕, 캠핑대장"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/8 transition-all bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        선택된 자리
                      </label>
                      <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
                        {selectedSpotId ? (
                          <div className="flex items-center gap-2">
                            <Tent className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-extrabold text-slate-800">
                              {spots.find((s) => s.id === selectedSpotId)?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">캠핑 지도를 선택해 주세요</span>
                        )}
                        {selectedSpotId && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg font-mono font-extrabold border border-blue-100 shadow-2xs">
                            {selectedSpotId.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Optional message to prompt-inject or talk to AI agent */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        에이전트에게 전할 한마디 (선택)
                      </label>
                      <textarea
                        placeholder="원하는 자리 예약과 관련된 특별한 사유나 질문이 있다면 작성하세요. (인공지능이 예약 여부를 결정하는 데 활용됩니다.)"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={3}
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/8 transition-all resize-none bg-white shadow-2xs"
                      />
                    </div>

                    <AnimatePresence>
                      {aiDecision && (aiDecision.isViolation || aiDecision.action === "reject" || aiDecision.action === "waitlist_suggest") && (
                        <motion.div
                          key="violation-decision-box"
                          initial={{ opacity: 0, y: -12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -12, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className={`p-4 rounded-xl border flex flex-col gap-3 ${
                            aiDecision.isViolation || aiDecision.action === "reject"
                              ? "bg-rose-50/60 border-rose-200/60 text-rose-950"
                              : "bg-amber-50/40 border-amber-200/60 text-amber-950"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-extrabold text-xs">
                            {aiDecision.isViolation || aiDecision.action === "reject" ? (
                              <>
                                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>심사 부적격 판정 (예약 취소/거부됨)</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>캠핑장 매진 안내 (대기 등록 권장)</span>
                              </>
                            )}
                          </div>

                          {aiDecision.ruleName && aiDecision.ruleName !== "해당 없음" && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-150 px-2.5 py-0.5 rounded-md self-start shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                              적용 규칙: {aiDecision.ruleName}
                            </div>
                          )}

                          <p className="text-slate-600 leading-relaxed text-[11px] font-semibold bg-white p-3 rounded-lg border border-slate-100 shadow-2xs">
                            {aiDecision.explanation}
                          </p>

                          {aiDecision.action === "waitlist_suggest" && (
                            <motion.button
                              type="button"
                              onClick={handleRegisterWaitlist}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              대기자 명단에 지금 등록하기
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={isEvaluating || !selectedSpotId}
                      whileHover={selectedSpotId && !isEvaluating ? { scale: 1.015 } : {}}
                      whileTap={selectedSpotId && !isEvaluating ? { scale: 0.985 } : {}}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isEvaluating
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : !selectedSpotId
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                      }`}
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          인공지능 규칙 심사 중...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          예약 적합성 AI 심사받기
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  /* Before Confirmation step: 반드시 사용자가 최종 확인 버튼을 눌러야 함 */
                  <motion.div
                    key="confirmation-step"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 flex flex-col gap-4.5"
                  >
                    <div className="flex items-center gap-2 text-blue-850 border-b border-blue-100 pb-2.5">
                      <Sparkles className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
                      <h4 className="font-extrabold text-xs text-blue-600">최종 예약 확정 전 마지막 확인</h4>
                    </div>

                    <div className="text-xs space-y-2.5 text-slate-700">
                      <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-2">
                        <span className="text-slate-400 font-medium">예약 대상 자리</span>
                        <span className="font-extrabold text-slate-800">
                          {spots.find((s) => s.id === selectedSpotId)?.name} ({selectedSpotId?.toUpperCase()})
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-2">
                        <span className="text-slate-400 font-medium">신청 모둠 / 팀</span>
                        <span className="font-extrabold text-slate-800">{teamNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-2">
                        <span className="text-slate-400 font-medium">사용자 별명</span>
                        <span className="font-extrabold text-slate-800">{nickname} 님</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {aiDecision && (
                        <motion.div
                          key="approval-decision-box"
                          initial={{ opacity: 0, scale: 0.95, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="bg-slate-900 text-slate-50 p-4 rounded-xl font-mono text-xs relative min-h-[80px] shadow-sm border border-slate-800"
                        >
                          <div className="text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            AI 분석 결과: [예약 가능 적합]
                          </div>
                          <p className="text-slate-300 leading-relaxed text-[11px] font-sans font-medium">{aiDecision.explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2.5 mt-2">
                      <motion.button
                        onClick={handleCancelBooking}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer text-center transition-all"
                      >
                        취소
                      </motion.button>
                      <motion.button
                        onClick={handleConfirmReservation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm shadow-blue-100 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        최종 예약 확정하기
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* VIEW 2: RED TEAM TEST SCREEN */}
        {activeTab === "redteam" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left/Center: Attack Sandbox */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      🕵️‍♂️ 인공지능 보안 실험실 (레드팀 공격)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      인공지능의 취약점을 공략하는 공격 질문을 던져보고, AI 예약 에이전트가 어떤 방어 규칙으로 방패를 들었는지 분석해 보세요.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveGlossary("redteam")}
                    className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1.5 shrink-0 bg-blue-50/50 border border-blue-100/50 px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-2xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    레드팀이란?
                  </button>
                </div>

                {/* Predefined Attack Presets */}
                <div className="mb-6">
                  <h3 className="text-xs font-extrabold text-slate-600 mb-3.5 flex items-center gap-1.5">
                    🎯 예시 공격 문장 선택 (클릭하여 주입)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {RED_TEAM_ATTACKS.map((attack) => (
                      <button
                        key={attack.id}
                        onClick={() => {
                          setRedteamPrompt(attack.prompt);
                        }}
                        className="bg-slate-50/40 hover:bg-rose-50/30 hover:border-rose-200/60 border border-slate-200/50 rounded-xl p-3.5 text-left transition-all text-xs flex flex-col gap-1.5 cursor-pointer hover:shadow-2xs group"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-extrabold text-slate-700 group-hover:text-rose-700 transition-colors">
                            {attack.title}
                          </span>
                          <span className="text-[9px] bg-slate-200/60 group-hover:bg-rose-100 group-hover:text-rose-800 text-slate-500 font-extrabold px-1.5 py-0.5 rounded-md transition-all font-mono">
                            {attack.defenseRuleName.split(" ")[0]}
                          </span>
                        </div>
                        <p className="font-mono text-slate-500 italic text-[11px] line-clamp-1">
                          &quot;{attack.prompt}&quot;
                        </p>
                        <p className="text-[10px] text-slate-400 group-hover:text-slate-500 leading-relaxed mt-0.5">
                          {attack.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Playground Area */}
                <div className="border border-slate-800/80 rounded-2xl bg-[#080C14] flex flex-col min-h-[380px] overflow-hidden shadow-md">
                  {/* Playground Header */}
                  <div className="bg-[#0E1524] border-b border-slate-800/80 px-4 py-3 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                      SECURITY CONSOLE v1.1
                    </span>
                    <button
                      onClick={() => setChatHistory([])}
                      className="text-slate-400 hover:text-rose-400 font-bold text-xs font-mono transition-colors cursor-pointer"
                    >
                      콘솔 비우기
                    </button>
                  </div>

                  {/* Chat logs */}
                  <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto max-h-[350px] bg-[#080C14]">
                    {chatHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-16 gap-3">
                        <Shield className="w-10 h-10 text-slate-800/60" />
                        <div className="max-w-md px-4">
                          <p className="text-xs font-extrabold text-slate-400">공격 콘솔이 활성화되어 있습니다</p>
                          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                            위의 추천 공격 문장을 클릭하여 주입하거나 밑에 직접 자유롭게 해킹 프롬프트를 넣거나 인공지능 윤리에 관한 질문을 작성해 보세요.
                          </p>
                        </div>
                      </div>
                    ) : (
                      chatHistory.map((item, index) => (
                        <div
                          key={index}
                          className={`flex flex-col max-w-[85%] ${
                            item.sender === "user" ? "self-end items-end" : "self-start items-start"
                          } animate-in fade-in duration-200`}
                        >
                          <span className="text-[10px] text-slate-500 font-mono mb-1 font-bold">
                            {item.sender === "user" ? "💻 RED TEAM (ATTACKER)" : "🛡️ SECURITY AI (DEFENDER)"}
                          </span>
                          <div
                            className={`rounded-2xl p-3.5 text-xs ${
                              item.sender === "user"
                                ? "bg-[#121A2E] border border-slate-800 text-[#F8FAFC] rounded-tr-none font-mono"
                                : "bg-[#0F1626] border border-slate-850/80 text-slate-100 rounded-tl-none shadow-xs"
                            }`}
                          >
                            {item.text}

                            {/* Show defense details if AI defended a rule */}
                            {item.decision && (
                              <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                  {item.decision.isViolation ? (
                                    <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 text-[9px] font-mono">
                                      <ShieldAlert className="w-3 h-3" /> 차단 성공
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 text-[9px] font-mono">
                                      <ShieldCheck className="w-3 h-3" /> 안전 승인
                                    </span>
                                  )}
                                  <span className="font-bold text-slate-400 text-[10px] font-mono">
                                    방어 규칙: {item.decision.ruleName}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {redteamLoading && (
                      <div className="self-start flex flex-col items-start max-w-[85%]">
                        <span className="text-[10px] text-slate-500 font-mono mb-1">🛡️ SECURITY AI (DEFENDER)</span>
                        <div className="bg-[#0F1626] border border-slate-850 text-slate-400 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-2.5 shadow-sm">
                          <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                          <span className="font-mono">인공지능 보안 심사단 방어 분석 중...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="p-3 bg-[#0E1524] border-t border-slate-800/80 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="공격 문장을 입력하거나 AI 윤리에 대해 질문하세요..."
                      value={redteamPrompt}
                      onChange={(e) => setRedteamPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendRedTeamAttack(redteamPrompt);
                      }}
                      disabled={redteamLoading}
                      className="flex-1 text-xs px-3.5 py-2.5 bg-[#080C14] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500/80 focus:ring-4 focus:ring-rose-500/10 transition-all font-mono"
                    />
                    <button
                      onClick={() => handleSendRedTeamAttack(redteamPrompt)}
                      disabled={redteamLoading || !redteamPrompt.trim()}
                      className={`p-2.5 rounded-xl text-white font-bold transition-all shrink-0 cursor-pointer ${
                        redteamPrompt.trim() && !redteamLoading
                          ? "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-sm"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Security Rules Guide and explanation of terms */}
            <div className="flex flex-col gap-6">
              {/* Defense Shield Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col gap-4 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500 animate-bounce" />
                  <span className="text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2.5 py-0.5 rounded-full">
                    보안 방화벽 가동 중
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-display text-white">예약 에이전트 5대 규칙</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    AI 에이전트는 규칙 지시사항(System Prompt)을 바탕으로 아래의 5가지 윤리 방어를 고수합니다.
                  </p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2.5 font-medium mt-1">
                  <li className="flex items-start gap-1.5 font-mono">
                    <span className="text-rose-400 font-extrabold">1.</span> 개인정보 차단 필터
                  </li>
                  <li className="flex items-start gap-1.5 font-mono">
                    <span className="text-rose-400 font-extrabold">2.</span> 1팀 1자리 정량 공급
                  </li>
                  <li className="flex items-start gap-1.5 font-mono">
                    <span className="text-rose-400 font-extrabold">3.</span> 명당 독점 매수 차단
                  </li>
                  <li className="flex items-start gap-1.5 font-mono">
                    <span className="text-rose-400 font-extrabold">4.</span> 잔여석 정보 무결성 검증
                  </li>
                  <li className="flex items-start gap-1.5 font-mono">
                    <span className="text-rose-400 font-extrabold">5.</span> 규칙 파괴(인젝션) 우회 무효화
                  </li>
                </ul>
              </div>

              {/* Terminology Explanation Board (어려운 용어 쉬운 설명) */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-extrabold text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                  <Info className="w-4 h-4 text-blue-500" />
                  어려운 보안 용어 쉬운 정리
                </h3>
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => setActiveGlossary("prompt_injection")}
                      className="font-extrabold text-xs text-slate-700 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer transition-all"
                    >
                      프롬프트 인젝션 (Prompt Injection)
                    </button>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      AI에게 유도 질문을 던져 원래의 안전 규칙을 강제로 깨뜨리는 해킹 수법입니다.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveGlossary("pii")}
                      className="font-extrabold text-xs text-slate-700 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer transition-all"
                    >
                      개인 식별 정보 (Personal Information)
                    </button>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      주소, 연락처, 생년월일 등 다른 사람에게 절대 유출되어서는 안 되는 중요한 정보입니다.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveGlossary("data_integrity")}
                      className="font-extrabold text-xs text-slate-700 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer transition-all"
                    >
                      데이터 무결성 (Data Integrity)
                    </button>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      시스템에 기록된 상태값이 거짓 없이 언제나 완벽하게 신뢰할 수 있게 정돈된 정도입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: PRESENTATION VIEW */}
        {activeTab === "presentation" && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                📊 인공지능 캠핑 예약 시스템 발표회
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                우리가 개발한 시스템의 문제 해결 과정과 인공지능 윤리 수립 결과를 발표 카드로 확인하세요.
              </p>
            </div>

            {/* Slider view of presentation cards */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden min-h-[420px] flex flex-col justify-between">
              {/* Card Category Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    PRESENTATION_CARDS[currentSlideIndex].category === "problem"
                      ? "bg-rose-50 text-rose-800 border border-rose-200/60"
                      : PRESENTATION_CARDS[currentSlideIndex].category === "ethics"
                      ? "bg-blue-50 text-blue-800 border border-blue-200/60"
                      : PRESENTATION_CARDS[currentSlideIndex].category === "test"
                      ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                      : "bg-violet-50 text-violet-800 border border-violet-200/60"
                  }`}
                >
                  {PRESENTATION_CARDS[currentSlideIndex].category === "problem"
                    ? "해결한 문제 (Problem Solved)"
                    : PRESENTATION_CARDS[currentSlideIndex].category === "ethics"
                    ? "윤리 가이드라인 (AI Ethics)"
                    : PRESENTATION_CARDS[currentSlideIndex].category === "test"
                    ? "보안 테스트 (Redteam Feedback)"
                    : "개선 내용 (Future Improvement)"}
                </span>

                <span className="text-xs text-slate-400 font-mono font-bold">
                  {currentSlideIndex + 1} / {PRESENTATION_CARDS.length}
                </span>
              </div>

              {/* Slide Content */}
              <div className="flex-1 flex flex-col gap-4 justify-center py-2">
                <h3 className="text-lg font-extrabold text-slate-900 font-display">
                  {PRESENTATION_CARDS[currentSlideIndex].title}
                </h3>
                {PRESENTATION_CARDS[currentSlideIndex].subtitle && (
                  <p className="text-xs font-bold text-blue-600/90 -mt-2">
                    {PRESENTATION_CARDS[currentSlideIndex].subtitle}
                  </p>
                )}

                {/* Bullets */}
                <ul className="space-y-2 text-xs text-slate-700 mt-3 font-semibold">
                  {PRESENTATION_CARDS[currentSlideIndex].points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-blue-500 font-extrabold shrink-0 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Descriptive rationale */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 mt-4 text-xs text-slate-600 leading-relaxed italic">
                  &ldquo; {PRESENTATION_CARDS[currentSlideIndex].explanation} &rdquo;
                </div>
              </div>

              {/* Slider controls */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                <button
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    currentSlideIndex === 0
                      ? "text-slate-300 border-slate-100 cursor-not-allowed"
                      : "text-slate-600 border-slate-200 hover:bg-slate-50/80 cursor-pointer"
                  }`}
                >
                  이전 슬라이드
                </button>

                {/* Dot indicators */}
                <div className="flex gap-2">
                  {PRESENTATION_CARDS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentSlideIndex ? "bg-blue-600 w-4" : "bg-slate-200 hover:bg-slate-300"
                      }`}
                    ></button>
                  ))}
                </div>

                {currentSlideIndex < PRESENTATION_CARDS.length - 1 ? (
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(PRESENTATION_CARDS.length - 1, prev + 1))}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    다음 슬라이드 <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab("booking")}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    직접 예약 체험하러 가기
                  </button>
                )}
              </div>
            </div>

            {/* Quick Summary Bento Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="bg-rose-50 text-rose-700 p-2 rounded-xl w-fit">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-800">프롬프트 취약점 해소</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  인공지능의 취약점인 프롬프트 우회 명령을 사전에 차단함으로써, 데이터 위조나 특혜 예약을 원천 봉쇄하였습니다.
                </p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="bg-blue-50 text-blue-700 p-2 rounded-xl w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-800">실시간 데이터 무결성</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  거짓 예약을 요구하는 사용자의 주입 공격을 거부하며, 올바르고 투명한 좌석 대기 정보를 100% 검증 유지합니다.
                </p>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="bg-amber-50 text-amber-700 p-2 rounded-xl w-fit">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-slate-800">대기자 구제 알고리즘</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  만석이 될 경우 실망하며 이탈하지 않고, 공평하게 자리가 날 경우 대기 순번대로 예약 권리를 승계받는 공정 메커니즘입니다.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Modern, Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 font-medium">
          <p>© 2026 공정한 캠핑장 자리 예약 시스템. 정보 보호 수립 및 AI 윤리 교육 실습 교안.</p>
        </div>
      </footer>
    </div>
  );
}
