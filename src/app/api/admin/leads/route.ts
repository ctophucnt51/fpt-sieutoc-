import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, updateLead, deleteLead, getLeadStats } from "@/lib/leadStorage";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: "Chưa xác thực quyền quản trị." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const searchQuery = searchParams.get("search")?.toLowerCase().trim();

  let leads = getAllLeads();

  if (statusFilter && statusFilter !== "all") {
    leads = leads.filter((l) => l.status === statusFilter);
  }

  if (searchQuery) {
    leads = leads.filter((l) =>
      l.fullName.toLowerCase().includes(searchQuery) ||
      l.phone.includes(searchQuery) ||
      l.id.toLowerCase().includes(searchQuery) ||
      (l.area && l.area.toLowerCase().includes(searchQuery)) ||
      (l.packageInterested && l.packageInterested.toLowerCase().includes(searchQuery))
    );
  }

  const stats = getLeadStats();

  return NextResponse.json({
    success: true,
    leads,
    stats,
    totalCount: leads.length,
  });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: "Chưa xác thực quyền quản trị." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, salesNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID khách hàng." }, { status: 400 });
    }

    const updated = updateLead(id, {
      ...(status ? { status } : {}),
      ...(salesNotes !== undefined ? { salesNotes } : {}),
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Không tìm thấy khách hàng với ID này." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin khách hàng thành công.",
      lead: updated,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Dữ liệu cập nhật không hợp lệ." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, message: "Chưa xác thực quyền quản trị." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu mã khách hàng cần xóa." }, { status: 400 });
    }

    const ok = deleteLead(id);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Không tìm thấy khách hàng hoặc đã bị xóa trước đó." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa bản ghi khách hàng thành công.",
    });
  } catch {
    return NextResponse.json({ success: false, message: "Lỗi trong quá trình xóa dữ liệu." }, { status: 500 });
  }
}
