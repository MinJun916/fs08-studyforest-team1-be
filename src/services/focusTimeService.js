import prisma from "../lib/prisma.js";

export const addFocusTime = async ({ studyId, focusTime }) => {

	if (!studyId) { // 스터디 아이디 필수
		const e = new Error("STUDY_ID_REQUIRED");
		e.status = 400;
		throw e;
	}

	const minutes = Number(focusTime);
	if (minutes <= 0) { // 집중 시간은 양수여야 함
		const e = new Error("FOCUS_TIME_MUST_BE_POSITIVE_NUMBER");
		e.status = 400;
		throw e;
	}

	// ensure study exists
	const study = await prisma.study.findUnique({ where: { id: studyId }, select: { id: true } });
	if (!study) { // 스터디가 존재하지 않음
		const e = new Error("STUDY_NOT_FOUND");
		e.status = 404;
		throw e;
	}

	const result = await prisma.$transaction(async (tx) => {
		const existing = await tx.focus.findFirst({ where: { studyId } });
		if (!existing) { // 기존 집중 시간 기록이 없으면 새로 생성
			return tx.focus.create({
				data: {
					study: { connect: { id: studyId } },
					time: Math.floor(minutes),
				},
			});
		}
		return tx.focus.update({ // 기존 집중 시간 기록이 있으면 시간 누적
			where: { id: existing.id },
			data: { time: existing.time + Math.floor(minutes) },
		});
	});

	return result;
};