//合并两个链表

public static void main(String[] args) {
    // 简单测试用例
    ListNode l1 = new ListNode(1);
    l1.next = new ListNode(3);
    l1.next.next = new ListNode(5);

    ListNode l2 = new ListNode(2);
    l2.next = new ListNode(4);
    l2.next.next = new ListNode(6);

    ListNode merged = mergeTwoLists(l1, l2);
    // 打印合并后的链表
    while (merged != null) {
        System.out.print(merged.val + " ");
        merged = merged.next;
    }
}

public static class ListNode {
    int val;
    ListNode next;
    ListNode(int val) {
        this.val = val;
    }
}

public static ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    // 定义ListNode类
    if (l1 == null) {
        return l2;
    }
    if (l2 == null) {
        return l1;
    }
    if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}
