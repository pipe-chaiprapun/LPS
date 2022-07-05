declare @CIF_KEY NVARCHAR(10),
	@CUSTOMER_NAME NVARCHAR(150),
	@DEPT NVARCHAR(10),
	@SUB_DEPT NVARCHAR(10),
	@UNIT NVARCHAR(10),
	@STAFF_NO NVARCHAR(10),
	@CUSTOMER_GROUP_NO NVARCHAR(19)

set @CIF_KEY = '%'
set @CUSTOMER_NAME = '%'
set @DEPT = 'G0001'
set @SUB_DEPT = '%'
set @UNIT = '%'
set @STAFF_NO = '%'
set @CUSTOMER_GROUP_NO = '709'

SELECT D.DEPT, 
				D.SUB_DEPT, D.UNIT_HEAD AS UNIT, C.STAFF_NO,
		   A.CIF_KEY, A.CUSTOMER_NAME, 
		   ISNULL(E.TOTAL_LIMIT, 0) / 1000000 AS CREDIT_LIMIT, 
		   ISNULL(E.CASH_OUTSTANDING, 0) / 1000000 AS OUTSTANDING_CASH, 
		   ISNULL(E.NONCASH_OUTSTANDING, 0) / 1000000 AS OUTSTANDING_NON_CASH, 
		   ISNULL(E.YIELD,0) AS YIELD,
		   --J.CUSTOMER_GROUP_NO,
		   Case When F.ROLE_DESC = G.ROLE_DESC THEN F.ROLE_DESC + ' ' + B.STAFF_NAME
		   Else G.ROLE_DESC + ' ' + B.STAFF_NAME End STAFF_NAME
	FROM DBO.LPS_CUSTOMER AS A
	LEFT JOIN DBO.LPS_USER AS B
	ON A.AO_KEY = B.AO_KEY
	LEFT JOIN DBO.LPS_USER_MAP_ROLE AS C
	ON B.STAFF_NO = C.STAFF_NO
	LEFT JOIN DBO.V_LPS_LST_HIERARCHY AS D
	ON C.ROLE_CODE = D.UNIT
	LEFT JOIN DBO.LPS_LIMIT_SUMMARY_BY_CIF AS E
	ON A.CIF_KEY = E.CIFNO
	LEFT JOIN DBO.LPS_ROLE AS F
	ON D.SUB_DEPT = F.ROLE_CODE
	LEFT JOIN DBO.LPS_ROLE AS G
	ON D.UNIT = G.ROLE_CODE
	LEFT JOIN DBO.LPS_PARAMETER AS H
	ON 1 = 1
	AND H.PARAM_TYPE = 'PROVISION_DATE'
	LEFT JOIN DBO.LPS_GROUP_MAP_ROLE AS I
	ON D.DEPT = I.ROLE_CODE
	WHERE A.CIF_KEY = CASE WHEN @CIF_KEY = '%' THEN A.CIF_KEY ELSE @CIF_KEY END
	AND A.CUSTOMER_NAME LIKE '%' + @CUSTOMER_NAME + '%'
	AND (D.DEPT = CASE WHEN @DEPT = '%' THEN D.DEPT ELSE @DEPT END OR I.GROUP_CODE = @DEPT)
	AND D.SUB_DEPT = CASE WHEN @SUB_DEPT = '%' THEN D.SUB_DEPT ELSE @SUB_DEPT END
	AND D.UNIT_HEAD = CASE WHEN @UNIT = '%' THEN D.UNIT_HEAD ELSE @UNIT END
	AND B.STAFF_NO = CASE WHEN @STAFF_NO = '%' THEN B.STAFF_NO ELSE @STAFF_NO END
	AND ((@CUSTOMER_GROUP_NO = '%' AND A.CIF_KEY IN (SELECT CIF_KEY FROM DBO.LPS_CUSTOMER)) OR (@CUSTOMER_GROUP_NO <> '%' AND A.CIF_KEY IN (SELECT CIF_KEY FROM DBO.LPS_CUSTOMER_GROUP WHERE CUSTOMER_GROUP_NO = @CUSTOMER_GROUP_NO)))
	ORDER BY D.DEPT, D.SUB_DEPT, D.UNIT, A.CIF_KEY

